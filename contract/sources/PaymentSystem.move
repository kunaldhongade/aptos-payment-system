module my_addrx::GlobalPaymentSystem {
    use std::coin::{transfer};
    use std::aptos_coin::AptosCoin;
    use std::signer;
    use std::vector;
    use std::timestamp;

    const ERR_PAYMENT_NOT_FOUND: u64 = 1;
    const ERR_INVALID_INDEX: u64 = 2;
    const ERR_NO_PAYMENTS_COLLECTION: u64 = 3;
    const ERR_NOT_PAYEE: u64 = 4;

    const Global_Payment_List: address = @sys_addrx;

    struct Payment has key, store, copy, drop {
        id: u64,
        payer: address,
        payee: address,
        amount: u64,
        timestamp: u64,
    }

    struct GlobalPaymentsCollection has key, store, drop {
        payments: vector<Payment>,
        last_payment_id: u64,
    }

    // This is a globally shared resource that stores all payments
    public entry fun init_global_payment_system(account: &signer) {
        let system_address = Global_Payment_List;

        if (!exists<GlobalPaymentsCollection>(system_address)) {
            let payments_collection = GlobalPaymentsCollection {
                payments: vector::empty<Payment>(),
                last_payment_id: 0,
            };
            move_to(account, payments_collection);
        };
    }

    // Function to make a payment and record it globally
    public entry fun make_payment(
        account: &signer,
        payee: address,
        amount: u64
    ) acquires GlobalPaymentsCollection {
        let payer_address = signer::address_of(account);

        assert!(exists<GlobalPaymentsCollection>(Global_Payment_List), ERR_NO_PAYMENTS_COLLECTION);
        // Transfer funds
        transfer<AptosCoin>(account, payee, amount);

        let timestamp = timestamp::now_seconds();

        let payments_collection_ref = borrow_global_mut<GlobalPaymentsCollection>(Global_Payment_List);

        let payment_id = payments_collection_ref.last_payment_id + 1;

        let new_payment = Payment {
            id: payment_id,
            payer: payer_address,
            payee,
            amount,
            timestamp,
        };

        vector::push_back(&mut payments_collection_ref.payments, new_payment);

        payments_collection_ref.last_payment_id = payment_id;
    }

    // Function to refund a payment based on payee and amount (if found)
    public entry fun refund_payment(
        account: &signer,
        payment_id: u64
    ) acquires GlobalPaymentsCollection {
        let global_address = Global_Payment_List;
        let payee_address = signer::address_of(account);

        let payments_collection_ref = borrow_global_mut<GlobalPaymentsCollection>(global_address);

        let payments_len = vector::length(&payments_collection_ref.payments);

        let i = 0;

        while (i < payments_len) {
            let payment_ref = vector::borrow(&payments_collection_ref.payments, i);

            if (payment_ref.id == payment_id) {
                assert!(payment_ref.payee == payee_address, ERR_NOT_PAYEE);

                transfer<AptosCoin>(account, payment_ref.payer, payment_ref.amount);

                vector::remove(&mut payments_collection_ref.payments, i);

                return
            };
            i = i + 1;
        };
        abort(ERR_PAYMENT_NOT_FOUND)
    }

    // View all payments made on the platform globally
    #[view]
    public fun view_all_payments(): vector<Payment> acquires GlobalPaymentsCollection {
        let global_payments_ref = borrow_global<GlobalPaymentsCollection>(Global_Payment_List);
        global_payments_ref.payments
    }

    // View a specific payment by index in the global collection
    #[view]
    public fun view_payment_by_index(index: u64): Payment acquires GlobalPaymentsCollection {
        let global_payments_ref = borrow_global<GlobalPaymentsCollection>(Global_Payment_List);

        assert!(index < vector::length(&global_payments_ref.payments), ERR_INVALID_INDEX);

        *vector::borrow(&global_payments_ref.payments, index)
    }

    #[view]
    public fun view_payment_by_id(payment_id: u64): Payment acquires GlobalPaymentsCollection {
      let global_payments_ref = borrow_global<GlobalPaymentsCollection>(Global_Payment_List);

      let payments_len = vector::length(&global_payments_ref.payments);

      let i = 0;
      while (i < payments_len) {
        let payment_ref = vector::borrow(&global_payments_ref.payments, i);
        if (payment_ref.id == payment_id) {
          return *payment_ref
        };
        i = i + 1;
      };
      abort(ERR_PAYMENT_NOT_FOUND)
    }

    // View the total number of payments made on the platform
    #[view]
    public fun view_total_payments(): u64 acquires GlobalPaymentsCollection {
        let global_payments_ref = borrow_global<GlobalPaymentsCollection>(Global_Payment_List);
        vector::length(&global_payments_ref.payments)
    }

    fun min(a: u64, b: u64): u64 {
      if (a < b) {
        a
      } else {
        b
      }
    }

    #[view]
    public fun view_payments_paginated(start: u64, limit: u64): vector<Payment> acquires GlobalPaymentsCollection {
      let global_payments_ref = borrow_global<GlobalPaymentsCollection>(Global_Payment_List);
      let payments_len = vector::length(&global_payments_ref.payments);
      
      let end = min(payments_len, start + limit);
      let result = vector::empty<Payment>();

      let i = start;
      while (i < end) {
          vector::push_back(&mut result, *vector::borrow(&global_payments_ref.payments, i));
          i = i + 1;
      };
      result
    }
}
