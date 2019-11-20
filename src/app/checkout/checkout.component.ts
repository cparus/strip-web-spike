import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements AfterViewInit {

  stripe;
  card;
  cardErrors;

  @ViewChild('cardElement', {static: false}) cardElement: ElementRef;

  constructor() { }

  ngAfterViewInit() {

    console.log(this.cardElement)


    this.stripe = Stripe('pk_test_yrwCXVF8CtZM1xR9tp4IEW9700MuZEZs5p');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
  }

}
