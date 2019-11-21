import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PaymentIntent } from '../core/models/PaymentIntent';
import { PaymentsService } from '../core/services/payments.service';

declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, AfterViewInit {

  paymentIntent: PaymentIntent;
  clientSecret: string;
  responeMessage: string;

  stripe;
  card;
  cardErrors;

  @ViewChild('cardElement', { static: false }) cardElement: ElementRef;

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit() {
    this.paymentIntent = { Amount: null, Currency: '' };
  }

  ngAfterViewInit() {
    this.stripe = Stripe('pk_test_yrwCXVF8CtZM1xR9tp4IEW9700MuZEZs5p');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
      this.cardErrors = error && error.message;
    });
  }

  sendPaymentIntent() {
    this.paymentIntent.Currency = 'usd';
    this.paymentsService.initializePayment(this.paymentIntent).subscribe((x) => this.clientSecret = x);
  }

  async submitPayment() {
    await this.stripe.confirmCardPayment(
      this.clientSecret,
      {
        payment_method: { card: this.card }
      }
    ).then((result) => {
      if (result.error) {
        // console.log(result.error);
        this.responeMessage = result.paymentIntent.status;
        // Display error.message in your UI.
      } else {
        console.log(result);
        this.responeMessage = result.paymentIntent.status;
        // console.log('success!');
        // The payment has succeeded
        // Display a success message
      }
    });
  }

}
