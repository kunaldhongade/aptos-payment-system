module my_addrx::PaymentSystem {
  use aptos_framework::coin::{
    transfer,
    Coin
  };
  use aptos_framework::aptos_coin::AptosCoin;
  use std::signer;
  use std::vector;
  use aptos_framework::timestamp;

  struct Payment has key, store, copy, drop {
    payer: address,
    payee: address,
    amount: u64,
    timestamp: u64,
  }

  struct PaymentsCollection has key, store {
    payments: vector < Payment > ,
  }

  public entry fun init_payment_system(account: & signer) {
    let payer_address = signer::address_of(account);

    // Ensure the user doesn't already have a PaymentsCollection
    if (!exists < PaymentsCollection > (payer_address)) {
      let payments_collection = PaymentsCollection {
        payments: vector::empty < Payment > (),
      };
      move_to(account, payments_collection);
    };
  }

  public entry fun make_payment(
    account: & signer,
    payee: address,
    amount: u64
  ) acquires PaymentsCollection {
    let payer_address = signer::address_of(account);

    assert!(exists < PaymentsCollection > (payer_address), 1);

    transfer < AptosCoin > (account, payee, amount);

    let timestamp = timestamp::now_seconds();
    let new_payment = Payment {
      payer: payer_address,
      payee,
      amount,
      timestamp,
    };

    let payments_collection_ref = borrow_global_mut < PaymentsCollection > (payer_address);
    vector::push_back( &mut payments_collection_ref.payments, new_payment);
  }

  public entry fun withdraw_payments(account: & signer) acquires PaymentsCollection {
    let payer_address = signer::address_of(account);

    let payments_collection_ref = borrow_global_mut < PaymentsCollection > (payer_address);

    payments_collection_ref.payments = vector::empty < Payment > ();
  }

  public entry fun refund_payment(
    account: & signer,
    payee: address,
    amount: u64
  ) acquires PaymentsCollection {
    let payer_address = signer::address_of(account);
    let payments_collection_ref = borrow_global_mut < PaymentsCollection > (payer_address);

    let payments_len = vector::length( & payments_collection_ref.payments);
    let i = 0;
    while (i < payments_len) {
      let payment_ref = vector::borrow( & payments_collection_ref.payments, i);
      if (payment_ref.payee == payee && payment_ref.amount == amount) {
        transfer < AptosCoin > ( & signer::borrow_from_address(payee), payer_address, amount);

        vector::remove( &mut payments_collection_ref.payments, i);
        return
      };
      i = i + 1;
    };
    abort(2);
  }

  public entry fun withdraw_payments(account: & signer) acquires PaymentsCollection {
    let payer_address = signer::address_of(account);

    let payments_collection_ref = borrow_global_mut < PaymentsCollection > (payer_address);

    payments_collection_ref.payments = vector::empty < Payment > ();
  }

  public entry fun destroy_payments_collection(account: & signer) acquires PaymentsCollection {
    let payer_address = signer::address_of(account);
    if (exists < PaymentsCollection > (payer_address)) {
      let _payments_collection = move_from < PaymentsCollection > (payer_address);
    }
  }

  #[view]
  public fun view_payments_history(account: address): vector < Payment > acquires PaymentsCollection {
    let payments_collection_ref = borrow_global < PaymentsCollection > (account);

    payments_collection_ref.payments
  }

  #[view]
  public fun view_payments_history_paginated(
    account: address,
    start: u64,
    limit: u64
  ): vector < Payment > acquires PaymentsCollection {
    let payments_collection_ref = borrow_global < PaymentsCollection > (account);
    let payments_len = vector::length( & payments_collection_ref.payments);

    let end =
      if (payments_len < start + limit) {
        return payments_len
      } else {
        return start + limit
      };

    let result = vector::empty < Payment > ();
    let i = start;
    while (i < end) {
      vector::push_back( &mut result, * vector::borrow( & payments_collection_ref.payments, i));
      i = i + 1;
    };
    return result
  }

  #[view]
  public fun view_payment_by_index(account: address, index: u64): Payment acquires PaymentsCollection {
    let payments_collection_ref = borrow_global < PaymentsCollection > (account);
    assert!(index < vector::length( & payments_collection_ref.payments), 3);
    * vector::borrow( & payments_collection_ref.payments, index)
  }

  #[view]
  public fun view_total_payments(account: address): u64 acquires PaymentsCollection {
    let payments_collection_ref = borrow_global < PaymentsCollection > (account);
    vector::length( & payments_collection_ref.payments)
  }
}