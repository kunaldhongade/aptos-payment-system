/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, message, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsCreatedBy, setPaymentsCreatedBy] = useState<Payment[]>([]);
  const [paymentsReceivedBy, setPaymentsReceivedBy] = useState<Payment[]>([]);

  interface Payment {
    payment_id: number;
    payer: string;
    payee: string;
    amount: number;
    msg: string;
  }

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleMakePayments = async (values: Payment) => {
    try {
      const paymentAMT = convertAmountFromHumanReadableToOnChain(values.amount, 8);

      if (!values.msg) {
        values.msg = "None";
      }

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::GlobalPaymentSystem::make_payment`,
          functionArguments: [values.payee, paymentAMT, values.msg],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Payment is Successful!");
      fetchAllPayments();
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
      console.log("Error processing Payments.", error);
    }
  };

  const handleRefundPayment = async (values: Payment) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::GlobalPaymentSystem::refund_payment`,
          functionArguments: [values.payment_id],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Refund is Successful!");
      fetchAllPayments();
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
      console.log("Error Refund.", error);
    }
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

  const fetchAllPaymentsByPayee = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::GlobalPaymentSystem::view_payments_by_payee`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const paymentsList = result[0] as
        | { id: number; payer: string; payee: string; amount: number; msg: string }[]
        | undefined;

      if (Array.isArray(paymentsList)) {
        setPaymentsReceivedBy(
          paymentsList.map((payment) => ({
            payment_id: payment.id,
            payer: payment.payer,
            payee: payment.payee,
            amount: payment.amount,
            msg: payment.msg,
          })),
        );
      } else {
        setPaymentsReceivedBy([]);
      }
    } catch (error) {
      console.error("Failed to payments done by address:", error);
    }
  };

  const fetchAllPaymentsByPayer = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::GlobalPaymentSystem::view_payments_by_payer`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const paymentsList = result[0] as
        | { id: number; payer: string; payee: string; amount: number; msg: string }[]
        | undefined;

      if (Array.isArray(paymentsList)) {
        setPaymentsCreatedBy(
          paymentsList.map((payment) => ({
            payment_id: payment.id,
            payer: payment.payer,
            payee: payment.payee,
            amount: payment.amount,
            msg: payment.msg,
          })),
        );
      } else {
        setPaymentsCreatedBy([]);
      }
    } catch (error) {
      console.error("Failed to payments done by address:", error);
    }
  };

  useEffect(() => {
    fetchAllPayments();
    fetchAllPaymentsByPayer();
    fetchAllPaymentsByPayee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fetchAllPaymentsByPayer, fetchAllPaymentsByPayee]);

  return (
    <>
      <LaunchpadHeader title="Make Payments" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Make Payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleMakePayments}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Address" name="payee" rules={[{ required: true }]}>
                  <Input placeholder="Enter Address of Payee" />
                </Form.Item>

                <Form.Item label="Payment Amount (APT)" name="amount" rules={[{ required: true }]}>
                  <Input placeholder="Enter Your Amount" type="number" />
                </Form.Item>

                <Form.Item label="Message" name="msg" rules={[{ required: true }]}>
                  <Input placeholder="Enter Message" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Make Payment
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Refund Payment</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleRefundPayment}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Payment ID" name="payment_id" rules={[{ required: true }]}>
                  <Input placeholder="eg. 1001" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Refund
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Payments done by You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {paymentsCreatedBy.map((payment, index) => (
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

          <Card>
            <CardHeader>
              <CardDescription>Get Payments You Received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {paymentsReceivedBy.map((payment, index) => (
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
