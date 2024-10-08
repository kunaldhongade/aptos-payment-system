# Simple Payment System - Frontend

This is the frontend for the **Simple Payment System** built on the **Aptos Blockchain**. The platform allows users to send and receive payments using the Aptos native token (**APT**) via smart contracts.

## Key Features

- **Send Payments**: Users can send payments to other addresses on the Aptos network.
- **View Payments**: Users can view their transaction history and payment details.
- **Refund Payments**: Refunds can be initiated automatically based on transaction history.
- **Unique Payment IDs**: Every payment is assigned a unique ID, which can be used to reference transactions.
- **Global Payment System**: No individual initialization is needed for each user, allowing for a streamlined payment process.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** extension (e.g., Petra Wallet) for blockchain interactions

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
cd payment-system
```

### 2. Install Dependencies

Install the necessary dependencies for the project using **npm** or **yarn**:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Environment Variables

You need to configure the environment variables for the frontend to interact with the Aptos blockchain. Create a `.env` file in the project root and add the following variables:

```bash
PROJECT_NAME=GlobalPaymentSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x28a4ba85d2158b999307af0ff676a986f1897b4a9c287b5ab3bbbea8636bb31e
```

Adjust the `NODE_URL` and `FAUCET_URL` if you are using **Testnet** or **Mainnet** instead of Devnet.

### 4. Run the Development Server

Start the development server by running:

```bash
npm run dev
```

or

```bash
yarn run dev
```

The app will be available at `http://localhost:5173`.

## How to Use the Platform

### 1. Connect Wallet

Upon opening the application, you'll be prompted to connect your Aptos wallet (e.g., Petra Wallet). This will allow you to interact with the Aptos blockchain and manage your payments.

### 2. Send Payment

To send a payment:

- Navigate to the **Send Payment** section.
- Enter the recipient's wallet address, the amount in APT, and any additional details.
- Click **Send Payment** to initiate the transaction.

The transaction will be confirmed via your connected Aptos wallet.

### 3. View Payment History

In the **Payment History** section, you can view all your past transactions, including the payment ID, amount, recipient, and date.

### 4. Refund Payments

To initiate a refund for a transaction:

- Go to **Refund Payment**.
- Select the payment you want to refund based on the unique payment ID.
- Click **Refund** to initiate the refund transaction.

This will transfer the payment amount back to the original sender without needing to manually specify the amount.

## Scripts

- **`npm start`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm test`**: Runs unit tests.

## Dependencies

The project uses the following key dependencies:

- **React**: UI library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for type-safe development.
- **Aptos SDK**: JavaScript/TypeScript SDK to interact with the Aptos blockchain.
- **Ant Design / Tailwind CSS**: For responsive UI design and layout.
- **Petra Wallet Adapter**: To connect and interact with the Aptos wallet.

## Conclusion

This frontend provides a seamless way to interact with the Simple Payment System smart contract on Aptos. Users can easily manage their payments, refunds, and transaction history with the secure and transparent nature of blockchain technology.

If you have any questions or need assistance with using the platform, feel free to reach out!
