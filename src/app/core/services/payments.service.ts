import { Injectable, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { PaymentIntentRequest } from '../models/PaymentIntentRequest';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { paymentIntents, plans } from 'stripe';
import { CreateStripeCustomerRequest } from '../models/CreateStripeCustomerRequest';
import { CreateSubscriptionRequest } from '../models/CreateSubscriptionRequest';

@Injectable({ providedIn: 'root' })
export class PaymentsService {

    constructor(private http: HttpClient) { }

    // returns payment intent response
    initializePayment(request: PaymentIntentRequest) {
        return this.http.post(`https://localhost:5001/api/payments/InitializePaymnet`, request)
            .pipe(map((response: paymentIntents.IPaymentIntent) => {
                return response;
            }));
    }

    createStripeCustomer(request: CreateStripeCustomerRequest) {
        return this.http.post(`https://localhost:5001/api/payments/CreateStripeCustomer`, request)
            .pipe(map((response: any) => {
                return response;
            }));
    }

    getSubscriptionPlans() {
        return this.http.get(`https://localhost:5001/api/payments/SubscriptionPlans`)
            .pipe(map((response: any) => {
                console.log(response);
                return response.data;
            }));
    }

    createSubscription(request: CreateSubscriptionRequest) {
        return this.http.post(`https://localhost:5001/api/payments/CreateSubscription`, request)
        .pipe(map((response: any) => {
            return response;
        }));
    }
}
