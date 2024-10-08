import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Input, message, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

interface Payment {
  payment_id: number;
  payer: string;
  payee: string;
  amount: number;
  msg: string;
}

export function MyCollections() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [jobsAppliedBy, setJobsAppliedBy] = useState<Job[]>([]);
  const [jobById, setJobById] = useState<Job | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllPayments = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::GlobalPaymentSystem::view_all_payments`,
      };

      const result = await aptosClient().view({ payload });

      const paymentsList = result[0] as { id: number; payer: string; payee: string; amount: number; msg: string }[];

      if (Array.isArray(paymentsList)) {
        setPayments(
          paymentsList.map((payment) => ({
            payment_id: payment.id,
            payer: payment.payer,
            payee: payment.payee,
            amount: payment.amount,
            msg: payment.msg,
          })),
        );
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to fetch Payments:", error);
    }
  };

  const handleFetchPoll = () => {
    if (jobId !== null) {
      fetchJobById(jobId);
    } else {
      message.error("Please enter a valid Job ID.");
    }
  };

  const fetchJobById = async (job_id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::GlobalPaymentSystem::view_payment_by_id`,
        functionArguments: [job_id],
      };
      const result = await aptosClient().view({ payload });
      const fetchedJob = result[0] as Payment;
      setJobById(fetchedJob);
    } catch (error) {
      console.error("Failed to fetch Jobs by freelancer:", error);
    }
  };

  const handleApplyJob = async (values: number) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::GlobalPaymentSystem::accept_job`,
          functionArguments: [values],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Job is created!");
      fetchAllJobs();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Applying Job.", error);
    }
  };

  const handleCompleteJob = async (values: number) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::GlobalPaymentSystem::complete_job`,
          functionArguments: [values],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Job is completed!");
      fetchAllJobs();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error completing Job.", error);
    }
  };

  const register_freelancer = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::GlobalPaymentSystem::register_freelancer`,
          functionArguments: [],
        },
      });
      message.success("Freelancer Registration Successful!");
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("Freelancer Registration Successful!");
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        console.error("Transaction rejected by user. You Already Initialized Balance");
        message.error("Transaction rejected by user. You Already Initialized Balance");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllPayments();
    fetchAllJobsAppliedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, jobs, fetchAllJobsAppliedBy]);
  return (
    <>
      <LaunchpadHeader title="Apply As Freelancer" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Necessary functions to register as Freelancer only once per account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-4">
                <Button variant="init" size="sm" className="text-primary" onClick={register_freelancer}>
                  Register As Freelancer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>All Available Payments on the Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={payments} rowKey="" className="max-w-screen-xl mx-auto">
                <Column title="Payments ID" dataIndex="payment_id" />
                <Column title="Payee" dataIndex="payee" render={(creator: string) => creator.substring(0, 10)} />
                <Column
                  title="Message"
                  dataIndex="msg"
                  render={(creator: string) => creator.substring(0, 300)}
                  responsive={["lg"]}
                />
                <Column
                  title="Payer"
                  dataIndex="payer"
                  render={(creator: string) => creator.substring(0, 6)}
                  responsive={["lg"]}
                />
                <Column
                  title="Payment Amt"
                  dataIndex="amount"
                  responsive={["lg"]}
                  render={(payment_amount: number) => convertAmountFromOnChainToHumanReadable(payment_amount, 8)}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Job By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Poll ID"
                  type="number"
                  value={jobId || ""}
                  onChange={(e) => setJobId(Number(e.target.value))}
                  style={{ marginBottom: 16 }}
                />
                <Button onClick={handleFetchPoll} variant="submit" size="lg" className="text-base w-full" type="submit">
                  Fetch Payment
                </Button>
                {jobById && (
                  <Card key={jobById.job_id} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Job ID: {jobById.job_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      <div className="p-2">
                        {payments.map((payment, index) => (
                          <Card key={index} className="mb-6 shadow-lg p-4">
                            <p className="text-sm text-gray-500 mb-4">Payments ID: {payment.payment_id}</p>
                            <Card style={{ marginTop: 16, padding: 16 }}>
                              {payment && (
                                <div>
                                  <Paragraph>
                                    <strong>Amount:</strong>{" "}
                                    <Tag>{convertAmountFromOnChainToHumanReadable(payment.amount, 8)}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Client:</strong> <Tag>{payment.payee}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>freelancer:</strong> <Tag>{payment.payer}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Message:</strong> {payment.msg}
                                  </Paragraph>
                                </div>
                              )}
                            </Card>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Jobs Applied By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {jobsAppliedBy.map((job, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Job ID: {job.job_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {job && (
                        <div>
                          <Paragraph>
                            <strong>Description:</strong> {job.description}
                          </Paragraph>
                          <Paragraph>
                            <strong>Client:</strong> <Tag>{job.client}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>freelancer:</strong> <Tag>{job.freelancer}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Payment:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(job.payment_amount, 8)}</Tag>
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Accepted:</strong>{" "}
                            {job.is_accepted ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Completed:</strong>{" "}
                            {job.is_completed ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Paid:</strong>{" "}
                            {job.is_paid ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>

                          <Paragraph className="my-2">
                            <strong>Is Freelancer Assigned:</strong>{" "}
                            {job.is_freelancer_assigned ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph>
                            <strong>End Time:</strong> {new Date(job.job_deadline * 1000).toLocaleString()}
                          </Paragraph>

                          {!job.is_completed && (
                            <Button
                              variant="submit"
                              size="lg"
                              className="text-base w-full"
                              type="submit"
                              onClick={() => handleCompleteJob(job.job_id)}
                            >
                              Complete Job
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get All Jobs On the Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {jobs.map((job, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Job ID: {job.job_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {job && (
                        <div>
                          <Paragraph>
                            <strong>Description:</strong> {job.description}
                          </Paragraph>
                          <Paragraph>
                            <strong>Client:</strong> <Tag>{job.client}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>freelancer:</strong> <Tag>{job.freelancer}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Payment:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(job.payment_amount, 8)}</Tag>
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Accepted:</strong>{" "}
                            {job.is_accepted ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Completed:</strong>{" "}
                            {job.is_completed ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Paid:</strong>{" "}
                            {job.is_paid ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Freelancer Assigned:</strong>{" "}
                            {job.is_freelancer_assigned ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph>
                            <strong>End Time:</strong> {new Date(job.job_deadline * 1000).toLocaleString()}
                          </Paragraph>

                          {!job.is_freelancer_assigned && (
                            <Button
                              variant="submit"
                              size="lg"
                              className="text-base w-full"
                              type="submit"
                              onClick={() => handleApplyJob(job.job_id)}
                            >
                              Apply for Job
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
