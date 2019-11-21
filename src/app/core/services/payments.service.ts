import { Injectable } from '@angular/core';
import { PaymentIntent } from '../models/PaymentIntent';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentsService {

    constructor(private http: HttpClient) { }


    // returns payment intent response

    initializePayment(paymentIntent: PaymentIntent) {
        return this.http.post(`https://localhost:5001/api/payments/InitializePaymnet`, paymentIntent)
            .pipe(map((response: any) => {
                return response.client_secret;
            }));
    }
}
