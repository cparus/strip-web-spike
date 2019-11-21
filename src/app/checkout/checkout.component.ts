import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PaymentIntent } from '../models/PaymentIntent';

declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, AfterViewInit {

  paymentIntent: PaymentIntent;

  stripe;
  card;
  cardErrors;

  @ViewChild('cardElement', { static: false }) cardElement: ElementRef;

  constructor() { }

  ngOnInit() {
    this.paymentIntent = { Amount: null, Currency: ''}
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
  }

  async submitPayment() {
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      // ...send the token to the your backend to process the charge
    }
  }

}
