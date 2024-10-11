import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
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
  const { account } = useWallet();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentById, setPaymentById] = useState<Payment | null>(null);
  const [paymentID, setPaymentID] = useState<number | null>(null);
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

  const handleFetchPaymentById = () => {
    if (paymentID !== null) {
      fetchPaymentById(paymentID);
    } else {
      message.error("Please enter a valid Payments ID.");
    }
  };

  const fetchPaymentById = async (job_id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::GlobalPaymentSystem::view_payment_by_id`,
        functionArguments: [job_id],
      };
      const result = await aptosClient().view({ payload });
      const fetchedJob = result[0] as Payment;
      setPaymentById(fetchedJob);
    } catch (error) {
      console.error("Failed to fetch Payment by id:", error);
    }
  };

  useEffect(() => {
    fetchAllPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  return (
    <>
      <LaunchpadHeader title="All Payments" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Payments on the Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={payments} rowKey="" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="payment_id" />
                <Column
                  title="Amount"
                  dataIndex="amount"
                  render={(payment_amount: number) => convertAmountFromOnChainToHumanReadable(payment_amount, 8)}
                />
                <Column title="Payer" dataIndex="payer" render={(creator: string) => creator.substring(0, 6)} />
                <Column
                  title="Payee"
                  dataIndex="payee"
                  responsive={["md"]}
                  render={(creator: string) => creator.substring(0, 10)}
                />
                <Column
                  title="Message"
                  dataIndex="msg"
                  responsive={["md"]}
                  render={(creator: string) => creator.substring(0, 300)}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Payment By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Poll ID"
                  type="number"
                  value={paymentID || ""}
                  onChange={(e) => setPaymentID(Number(e.target.value))}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  onClick={handleFetchPaymentById}
                  variant="submit"
                  size="lg"
                  className="text-base w-full"
                  type="submit"
                >
                  Fetch Payment
                </Button>
                {paymentById && (
                  <Card key={paymentById.payment_id} className="mb-6 shadow-lg p-4">
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      <div className="p-2">
                        <Card className="mb-6 shadow-lg p-4">
                          <p className="text-sm text-gray-500 mb-4">Payments ID: {paymentID}</p>
                          <Card style={{ marginTop: 16, padding: 16 }}>
                            <div>
                              <Paragraph>
                                <strong>Amount:</strong>{" "}
                                <Tag>{convertAmountFromOnChainToHumanReadable(paymentById.amount, 8)}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Payee:</strong> <Tag>{paymentById.payee}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Payer:</strong> <Tag>{paymentById.payer}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Message:</strong> {paymentById.msg}
                              </Paragraph>
                            </div>
                          </Card>
                        </Card>
                      </div>
                    </Card>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>All Payments on the Platform</CardDescription>
            </CardHeader>
            <CardContent>
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
                            <strong>Payee:</strong> <Tag>{payment.payee}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Payer:</strong> <Tag>{payment.payer}</Tag>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
