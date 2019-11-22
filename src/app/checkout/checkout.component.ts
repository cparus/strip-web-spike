import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PaymentIntentRequest } from '../core/models/PaymentIntentRequest';
import { PaymentsService } from '../core/services/payments.service';
import { customers, paymentIntents, plans, subscriptions, subscriptionItems } from 'stripe';
import { CreateStripeCustomerRequest } from '../core/models/CreateStripeCustomerRequest';
import { CreateSubscriptionRequest } from '../core/models/CreateSubscriptionRequest';

declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, AfterViewInit {

  paymentIntentRequest: PaymentIntentRequest;
  createStripeCustomerRequest: CreateStripeCustomerRequest;
  clientSecret: string;
  responeMessage: string;
  cardFieldEmpty: boolean;
  cardErrors: string;
  stripeCustomer: customers.ICustomer;
  subscriptionPlans: plans.IPlan[];
  processingRequest: boolean;

  createSubscriptionRequest: CreateSubscriptionRequest;
  selectedPlan: plans.IPlan;

  // 0 for submitting card payments, 1 for selecting subscription
  formState: number;
  // 0 for one-time payments, 1 for subscriptions
  paymentType: number;

  email: string;

  stripe;
  card;

  @ViewChild('cardElement', { static: false }) cardElement: ElementRef;

  constructor(private paymentsService: PaymentsService) { }

  ngOnInit() {
    this.paymentType = 0;
    this.formState = 0;
    this.initVariables();
  }

  initVariables() {
    this.processingRequest = false;
    this.cardFieldEmpty = true;
    this.paymentIntentRequest = { Amount: null, Currency: '' };
    this.createStripeCustomerRequest = { Email: '', PaymentMethod: '' };
    this.createSubscriptionRequest = { PlanId: '', StripeCustomerId: '' }
  }

  ngAfterViewInit() {
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
    if (this.paymentIntentRequest.Amount) {
      this.paymentIntentRequest.Currency = 'usd';
      this.paymentsService.initializePayment(this.paymentIntentRequest)
        .subscribe((x: paymentIntents.IPaymentIntent) => this.clientSecret = x.client_secret);
    }
  }

  // for one time payments just send off payment
  // for subscriptions create payment method and user in stripe first
  submitPayment() {
    this.processingRequest = true;
    if (this.paymentType === 0) {
      this.confirmCardPayment();
    } else {
      this.createPaymentMethod();
    }
  }

  createPaymentMethod() {
    this.stripe.createPaymentMethod('card', this.card, {
      billing_details: {
        email: this.email,
      },
    }).then((result) => {
      if (result.error) {
        // console.log(result);
      } else {
        this.createStripeCustomerRequest.Email = this.email;
        this.createStripeCustomerRequest.PaymentMethod = result.paymentMethod.id;

        this.paymentsService.createStripeCustomer(this.createStripeCustomerRequest)
          .subscribe((x: customers.ICustomer) => {
            this.stripeCustomer = x;
            this.paymentsService.getSubscriptionPlans().subscribe((x: plans.IPlan[]) => {
              this.processingRequest = false;
              this.subscriptionPlans = x;
              this.formState++;
            });
          });
      }
    });
  }

  purchaseSubscription() {
    this.processingRequest = true;
    this.createSubscriptionRequest.PlanId = this.selectedPlan.id;
    this.createSubscriptionRequest.StripeCustomerId = this.stripeCustomer.id;

    this.paymentsService.createSubscription(this.createSubscriptionRequest).subscribe((x: subscriptions.ISubscription) => {
      this.processingRequest = false;
      this.responeMessage = 'successfully subscribed';
    }
    );
  }

  togglePaymentOptions() {
    this.initVariables();
  }

  // returns payment_intent object we can monitor the payment_intent.succeeded hook to determine when we need to fullfill the customer's order
  confirmCardPayment() {
    this.stripe.confirmCardPayment(
      this.clientSecret,
      {
        payment_method: { card: this.card }
      }
    ).then((result) => {
      this.processingRequest = false;
      if (result.error) {
        this.responeMessage = result.paymentIntent.status;
      } else {
        this.responeMessage = result.paymentIntent.status;
      }
    });
  }
}
