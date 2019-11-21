import { Injectable } from '@angular/core';
import { PaymentIntentRequest } from '../models/PaymentIntentRequest';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { paymentIntents } from 'stripe';

@Injectable({ providedIn: 'root' })
export class PaymentsService {

    constructor(private http: HttpClient) { }

    // returns payment intent response
    initializePayment(paymentIntent: PaymentIntentRequest) {
        return this.http.post(`https://localhost:5001/api/payments/InitializePaymnet`, paymentIntent)
            .pipe(map((response: paymentIntents.IPaymentIntent) => {
                return response;
            }));
    }

    createStripeCustomer() {
        return this.http.post(`https://localhost:5001/api/payments/InitializePaymnet`, 0)
            .pipe(map((response: any) => {
                return response;
            }));
    }
}
