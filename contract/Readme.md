# Global Payment System Smart Contract

## Overview

The **Global Payment System** is a decentralized contract built on the Aptos blockchain, designed to facilitate peer-to-peer payments and maintain a global ledger of all transactions. It offers various functionalities such as making payments, viewing transaction history, refunds, and payment details based on specific criteria. The contract stores all payment information centrally under a global address for easy access and management.

## Features

- **Global Storage**: All payments are stored in a global ledger accessible through a single address, making it easier to track and query transactions.
- **Payments**: Users can make payments in Aptos Coin (APT), and the system logs the transaction details including payer, payee, amount, and timestamp.
- **Refunds**: Payees can issue refunds for payments they've received, transferring the original payment amount back to the payer.
- **View Payments**: Supports multiple ways to view payments, including:
  - All payments
  - Payments by payer
  - Payments by payee
  - Payment by unique ID
  - Payment by index
  - Paginated views of payments
- **Security**: Only the payee can issue refunds, ensuring secure and authorized reversal of payments.

## Contract Functions

### 1. `init_global_payment_system(account: &signer)`

Initializes the global payment system by setting up the collection to store payments. This function can only be called once to prevent redundant initializations.

### 2. `make_payment(account: &signer, payee: address, amount: u64, msg: String)`

Transfers Aptos Coin (APT) from the payer to the specified payee and logs the payment in the global ledger. This function requires the payer to sign the transaction.

### 3. `refund_payment(account: &signer, payment_id: u64)`

Allows the payee to refund a previously received payment by its ID. This function transfers the original payment amount back to the payer and removes the payment from the global ledger.

### 4. `view_all_payments()`

Returns a vector of all payments made on the platform.

### 5. `view_payment_by_index(index: u64)`

Returns a specific payment by its index in the global payments vector.

### 6. `view_payment_by_id(payment_id: u64)`

Returns a specific payment by its unique payment ID.

### 7. `view_total_payments()`

Returns the total number of payments recorded in the system.

### 8. `view_payments_paginated(start: u64, limit: u64)`

Returns a paginated list of payments starting from the specified index (`start`) and limited by the number of records (`limit`).

### 9. `view_payments_by_payer(payer: address)`

Returns a vector of all payments made by a specific payer.

### 10. `view_payments_by_payee(payee: address)`

Returns a vector of all payments received by a specific payee.

## Errors

The contract includes custom error codes for handling various failure cases:

- `ERR_PAYMENT_NOT_FOUND`: The specified payment was not found.
- `ERR_INVALID_INDEX`: The provided index is invalid.
- `ERR_NO_PAYMENTS_COLLECTION`: The payments collection does not exist.
- `ERR_NOT_PAYEE`: Only the payee can issue a refund for a payment.
- `ERR_ALREADY_INITIALIZED`: The global payment system is already initialized.

## Usage Guide

1. **Initialization**: Call the `init_global_payment_system()` function once to initialize the global payment system. Only one instance can exist.
2. **Making Payments**: Use `make_payment()` to transfer funds from the payer to the payee. The system will automatically log the payment details such as the amount, payer, payee, and a message attached to the payment.

3. **Refunding Payments**: Payees can call the `refund_payment()` function with the payment ID to refund the payment amount back to the payer. Only the payee can perform this action.

4. **Viewing Payments**: Utilize various view functions like `view_all_payments()`, `view_payment_by_id()`, or `view_payments_by_payer()` to track and analyze transactions.

## Security Considerations

- **Refunds**: Only the payee can initiate a refund, which ensures that refunds are secure and authorized.
- **Global Storage**: The contract stores all payment data centrally under the address defined as `Global_Payment_List`, ensuring a unified, queryable ledger for all transactions.
