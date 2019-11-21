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
  cardFieldEmpty: boolean;
  cardErrors: string;

  stripe;
  card;

  @ViewChild('cardElement', { static: false }) cardElement: ElementRef;

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit() {
    this.paymentIntent = { Amount: null, Currency: '' };
  }

  ngAfterViewInit() {
    this.cardFieldEmpty = true;

    this.stripe = Stripe('pk_test_yrwCXVF8CtZM1xR9tp4IEW9700MuZEZs5p');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', (listener) => {
      this.cardFieldEmpty = listener.empty;
      this.cardErrors = listener.error && listener.error.message;
    });
  }

  sendPaymentIntent() {
    if (this.paymentIntent.Amount) {
      this.paymentIntent.Currency = 'usd';
      this.paymentsService.initializePayment(this.paymentIntent).subscribe((x) => this.clientSecret = x);
    }
  }

  // returns payment_intent object we can monitor the payment_intent.succeeded hook to determine when we need to fullfill the customer's order
  async submitPayment() {
    await this.stripe.confirmCardPayment(
      this.clientSecret,
      {
        payment_method: { card: this.card }
      }
    ).then((result) => {
      if (result.error) {
        this.responeMessage = result.paymentIntent.status;
      } else {
        this.responeMessage = result.paymentIntent.status;
      }
    });
  }
}
