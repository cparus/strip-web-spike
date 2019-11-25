# StripeWebSpike

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2. It serves as a web interface for facilitating payments to Stripe. The two type of transactions we will be focusing on are one-time payments and a subscription service. This client should be ran against the server spike project located at: https://github.com/cparus/stripe-api-spike

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Table of Contents
 [Installing Dependecies](#dependencies)<br>
 [One-Time Payments](#onetimepayments)<br>
 [Subscriptions](#subscriptions)<br>

<div id="pre">

## Installing Dependenceis

```
npm install --save @types/stripe-v3
```

The only dependency I downloaded was to grab the types for the stripe objects.

<div id="dependencies">


## One-Time Payments

This is the flow for creating one-time payments via stripe docs: https://stripe.com/docs/payments/payment-intents/migration/automatic-confirmation#saving-cards-checkout

Server implementations: https://github.com/cparus/stripe-api-spike

<div id="onetimepayments">


## Subscriptions

This is the flow for creating one-time payments via stripe docs: https://stripe.com/docs/billing/subscriptions/set-up-subscription

Server implementations: https://github.com/cparus/stripe-api-spike

<div id="subscriptions">



