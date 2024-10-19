# 🚀 Simple Payment System - Frontend

Welcome to the **Simple Payment System** frontend, a decentralized application built on the **Aptos Blockchain**. This platform enables users to send, receive, and manage payments using the Aptos native token (**APT**) with secure smart contract interactions. Whether sending payments, tracking history, or managing refunds, the platform offers a seamless payment experience powered by blockchain.

---

## 🔗 Links

- **Live Demo**: [Simple Payment System](https://aptos-payment-system.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x28a4ba85d2158b999307af0ff676a986f1897b4a9c287b5ab3bbbea8636bb31e/modules/code/GlobalPaymentSystem?network=testnet)

---

## ✨ Key Features

- **Send Payments**: Easily transfer Aptos tokens (APT) to other wallet addresses.
- **View Payment History**: Access detailed transaction history with unique payment IDs.
- **Refund Payments**: Initiate refunds directly based on past transactions.
- **Unique Payment Identifiers**: Each payment is assigned a unique ID for easy tracking.
- **Global Payment System**: No additional setup is required for users, ensuring a streamlined process.

---

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., **Petra Wallet**) for managing blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

Clone the project repository and navigate to the project folder:

```bash
cd payment-system
```

### 2. Install Dependencies

Install the necessary packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
PROJECT_NAME=GlobalPaymentSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x28a4ba85d2158b999307af0ff676a986f1897b4a9c287b5ab3bbbea8636bb31e
```

Update the `VITE_MODULE_ADDRESS` if your contract is deployed to a different address.

### 4. Run the Development Server

Start the local server with:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    sys_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "28a4ba85d2158b999307af0ff676a986f1897b4a9c287b5ab3bbbea8636bb31e"
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

- Click **Connect Wallet** to link your Aptos wallet (e.g., **Petra Wallet**).
- This connection allows you to send payments, view history, and manage refunds.

### 2. Send Payment

1. Navigate to the **Send Payment** section.
2. Enter the **recipient's wallet address**, the **amount in APT**, and optional transaction details.
3. Click **Send Payment** and confirm the transaction through your connected wallet.
4. The payment will be processed securely through the Aptos blockchain.

### 3. View Payment History

- Go to **Payment History** to see all your past transactions.
- Each payment entry includes:
  - **Unique Payment ID**
  - **Recipient Address**
  - **Amount Sent**
  - **Date of Transaction**

### 4. Refund Payment

1. Navigate to **Refund Payment**.
2. Select a payment by entering the **Payment ID** from your transaction history.
3. Click **Refund** to initiate the refund transaction.
4. The refunded amount will automatically transfer back to the original sender.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the app for production.
- **`npm test`**: Run unit tests.

---

## 🔍 Dependencies

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed JavaScript for better development practices.
- **Aptos SDK**: For seamless blockchain interaction.
- **Ant Design**: Elegant UI components for a polished interface.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Petra Wallet Adapter**: For Aptos wallet connection.

---

## 📚 Available Smart Contract Functions

1. **send_payment(sender: &signer, recipient: address, amount: u64)**: Initiates a payment from the sender to the recipient.
2. **view_payments_by_user(user: address)**: Returns the payment history of a specific user.
3. **refund_payment(sender: &signer, payment_id: u64)**: Processes a refund for the given payment ID.
4. **get_payment_details(payment_id: u64)**: Retrieves detailed information about a specific payment.

---

## 🛡 Security and Transparency

- **Blockchain-Powered Transactions**: All payments are processed on the Aptos blockchain for security and transparency.
- **Unique Payment IDs**: Each transaction is assigned a unique identifier for tracking and auditing.
- **Direct Refunds**: Refunds are initiated automatically through smart contracts without manual input.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Issues**: Ensure your wallet is installed and connected to the correct network (e.g., **Testnet**).
2. **RPC Request Limits**: Use private RPC endpoints if public ones hit rate limits.
3. **Transaction Failures**: Verify that your wallet has enough funds for the transaction and gas fees.

---

## 🚀 Scaling and Deployment

When deploying to **Vercel** or similar platforms, consider the following:

- Use **private RPC providers** like **QuickNode** or **Alchemy** to avoid rate limits.
- Implement **request throttling** to manage traffic efficiently.
- Utilize **WebSockets** for real-time payment updates.

---

## 🎉 Conclusion

The **Simple Payment System** offers a secure and transparent way to send and receive payments on the Aptos blockchain. With unique payment IDs, automated refunds, and seamless wallet integration, the platform simplifies digital transactions for all users. Whether you are sending payments or managing refunds, this frontend ensures a smooth experience with the trust and reliability of blockchain technology.
