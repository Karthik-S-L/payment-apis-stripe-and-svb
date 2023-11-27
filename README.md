## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository for Payment Services.

Currently SVB and STRIPE Payments are enabled!

## Setting up / Using the Payment Services -

Make **.env** file in your project and initialize all the variables as per **.env.example** variables, Please make sure you have included variable as `PAYMENT_SERVICE_PROVIDER` `= ['STRIPE', 'SVB']` or `['SVB']`or `['STRIPE']`or the Payment you have added apart from these 2 inbuilt!

Then initialize the _controllers_ and _services_ from the **payment.module.ts** file via the factory methods _serviceFactory_(for services) and controllerFactory (for controllers). Also you can add extra payment services controllers and services over here!

## Installation

```bash

$ npm install

```

## Running the app

```bash

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## Test

```bash

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

```

# SVB

Silicon Valley Bank is an American commercial bank.SVB offers APIs to connect to clients applications to initiate payments such as Wires, ACH, and FX Contracts.

## Getting Started with SVB

### First Step :

To Use the SVB APIs we need two secret values one is **SVB_CLIENT_ID** and **SVB_CLIENT_SECRET**.

To implement SVB APIs in Nestjs first we need to install the required npm packages using the below command.

```
npm install axios jws uuid

```

### Initiating Payment :

We need access token to initiate payment this can be done by sending a post request to url - 'https://uat.api.svb.com/v1/security/oauth/token' the request body should contain 2 header parameters.

1. `"Content-Type": "application/x-www-form-urlencoded"`,

2. `` Authorization: `Basic ${credentialsBuffer.toString("base64")}` ``,
   },

We will get a access token in the response which is used to initiate payment.

To submit SVB Transfer Request we need to make a post request to the svb transfer url 'https://uat.api.svb.com/v2/transfer/domestic-verified-achs' the header parameters should contain authorization header which is access token and another header should contain -

```
"x-jws-signature": jwsSignature.
```

The request body should contain batch details such as **svb_account_number**, **direction**, **sec_code** and transfer details such as **amount**, **identification_number** and other details.

**Request body :**

```
{
    "batch_details": {
        "svb_account_number": "1111111111",
        "direction": "CREDIT",
        "sec_code": "WEB"
    },
    "transfers": [
        {
            "amount": 5555537,
            "identification_number": "111115234AB",
            "counterparty_name": "Michael Clarke",
            "provider_service": "PLAID",
            "provider_id": "processor-sandbox-cf30b4ca-7b1b-41f8-872e-faeb6a79211f"
        }
    ]
}
```

**The response :**

```
{
    "results": [
        {
            "effective_entry_date": "2023-01-23",
            "svb_account_number": "1111111111",
            "currency": "USD",
            "company_name": "Caramel Inc",
            "direction": "CREDIT",
            "settlement_priority": "STANDARD",
            "sec_code": "WEB",
            "provider_service": "PLAID",
            "provider_id": "processor-sandbox-cf30b4ca-7b1b-41f8-872e-faeb6a79211f",
            "counterparty_name": "Michael Clarke",
            "additional_information": {},
            "amount": 5555537,
            "identification_number": "111115234AB",
            "id": "7b6dbc7b-babd-455d-817d-a81a7b9c5d6f",
            "status": "PENDING",
            "mass_delivery_id": "ac67cbbc-a86d-4b56-9549-294a9dfdca03",
            "created_at": "2023-01-20T05:57:43.168793Z",
            "updated_at": "2023-01-20T05:57:43.168793Z",
            "index": 0,
            "validation_status": "SUCCESS"
        }
    ],
    "links": []
}
```

## List all transactions

To list down all the Transactions in the svb instance we need to make a **Get** request on the url - 'https://uat.api.svb.com/v2/transfer/domestic-achs' the header parameters will contain -

1. `` Authorization:  `Bearer ${svbLoginToken}`  ``
2. `prefer:  RETURN_REPRESENTATION`

**Response** -

```json
{
  "links": [
    {
      "rel": "first",
      "href": "http://uat.api.svb.com/v2/transfer/domestic-achs?offset=1&limit=5"
    },
    {
      "rel": "self",
      "href": "http://uat.api.svb.com/v2/transfer/domestic-achs?offset=1&limit=5"
    },
    {
      "rel": "next",
      "href": "http://uat.api.svb.com/v2/transfer/domestic-achs?offset=2&limit=5"
    },
    {
      "rel": "last",
      "href": "http://uat.api.svb.com/v2/transfer/domestic-achs?offset=43&limit=5"
    }
  ],
  "items": [
    {
      "effective_entry_date": "2023-01-18",
      "svb_account_number": "1111111111",
      "currency": "USD",
      "company_name": "Caramel Inc",
      "direction": "CREDIT",
      "settlement_priority": "STANDARD",
      "sec_code": "WEB",
      "receiver_account_number": "1111222233330000",
      "receiver_account_type": "CHECKING",
      "receiver_name": "Michael Clarke",
      "receiver_routing_number": "011401533",
      "additional_information": {},
      "amount": 5555536,
      "identification_number": "111115234AB",
      "batch_id": "209636",
      "id": "fbcf983e-034e-4b43-be72-6f4073cfc4b3",
      "status": "SUCCEEDED",
      "fed_trace_number": "045816439973923",
      "mass_delivery_id": "21e4dfd4-3211-4232-8d3b-1a1f8784caad",
      "created_at": "2023-01-17T06:52:49.593731Z",
      "updated_at": "2023-01-19T17:41:02.038165Z",
      "links": []
    },
    {
      "effective_entry_date": "2023-01-18",
      "svb_account_number": "1111111111",
      "currency": "USD",
      "company_name": "Caramel Inc",
      "direction": "CREDIT",
      "settlement_priority": "STANDARD",
      "sec_code": "WEB",
      "receiver_account_number": "1111222233330000",
      "receiver_account_type": "CHECKING",
      "receiver_name": "Michael Clarke",
      "receiver_routing_number": "011401533",
      "additional_information": {},
      "amount": 5555536,
      "identification_number": "111115234AB",
      "batch_id": "209636",
      "id": "67338172-3338-468d-b5a6-9d1849954bae",
      "status": "SUCCEEDED",
      "fed_trace_number": "555642169783732",
      "mass_delivery_id": "d0c61440-78ab-47e5-a596-3b2e3e8a1efd",
      "created_at": "2023-01-17T06:39:31.349588Z",
      "updated_at": "2023-01-19T17:43:15.163490Z",
      "links": []
    },
    {
      "effective_entry_date": "2023-01-18",
      "svb_account_number": "1111111111",
      "currency": "USD",
      "company_name": "Caramel Inc",
      "direction": "CREDIT",
      "settlement_priority": "STANDARD",
      "sec_code": "WEB",
      "receiver_account_number": "1111222233330000",
      "receiver_account_type": "CHECKING",
      "receiver_name": "Michael Clarke",
      "receiver_routing_number": "011401533",
      "additional_information": {},
      "amount": 5555537,
      "identification_number": "111115234AB",
      "batch_id": "209636",
      "id": "69811ffa-7a26-4822-b1a0-a64074de1083",
      "status": "SUCCEEDED",
      "fed_trace_number": "946159018724670",
      "mass_delivery_id": "11754329-4329-4129-9665-bccacbd77af0",
      "created_at": "2023-01-17T11:01:25.063893Z",
      "updated_at": "2023-01-19T17:45:43.131894Z",
      "links": []
    },
    {
      "effective_entry_date": "2023-01-18",
      "svb_account_number": "1111111111",
      "currency": "USD",
      "company_name": "Caramel Inc",
      "direction": "DEBIT",
      "settlement_priority": "STANDARD",
      "sec_code": "PPD",
      "receiver_account_number": "1111222233331111",
      "receiver_account_type": "SAVINGS",
      "receiver_name": "Plaid Saving",
      "receiver_routing_number": "011401533",
      "additional_information": {},
      "amount": 10651950,
      "identification_number": "4ml1Q0BPToE",
      "batch_id": "209637",
      "id": "39827911-928e-4176-91ad-645cc1b12ea1",
      "status": "SUCCEEDED",
      "fed_trace_number": "154528824033582",
      "mass_delivery_id": "ec74f016-eed0-4d5a-bb10-0185b1cf65f1",
      "created_at": "2023-01-16T08:09:59.533736Z",
      "updated_at": "2023-01-19T17:47:53.721564Z",
      "links": []
    },
    {
      "effective_entry_date": "2023-01-18",
      "svb_account_number": "1111111111",
      "currency": "USD",
      "company_name": "Caramel Inc",
      "direction": "DEBIT",
      "settlement_priority": "STANDARD",
      "sec_code": "PPD",
      "receiver_account_number": "1111222233330000",
      "receiver_account_type": "CHECKING",
      "receiver_name": "Plaid Checking",
      "receiver_routing_number": "011401533",
      "additional_information": {},
      "amount": 3311992,
      "identification_number": "GwQQOU1BxXM",
      "batch_id": "209644",
      "id": "d387b731-95e1-4eaa-8926-86fb3a4182df",
      "status": "SUCCEEDED",
      "fed_trace_number": "301709690332687",
      "mass_delivery_id": "1c6bcce5-bac9-4678-8ca6-9d6c42e9343c",
      "created_at": "2023-01-17T18:16:26.738525Z",
      "updated_at": "2023-01-20T17:44:26.858377Z",
      "links": []
    }
  ],
  "total_items": 211,
  "total_pages": 43
}
```

**Query params Available -**

| Property name                | default value or example                                          | Type   | Minvalue | MaxValue |
| ---------------------------- | ----------------------------------------------------------------- | ------ | -------- | -------- |
| offset                       | 1                                                                 | Int    | 1        | NA       |
| limit                        | 1000                                                              | Int    | 1000     | 10000    |
| effective_entry_date         | 22-1-2023                                                         | String | NA       | NA       |
| status                       | PENDING, CANCELED, PROCESSING, HOLD, SUCCEEDED, FAILED, CORRECTED | String | NA       | NA       |
| svb_account_number           | 1111111111                                                        | string | NA       | NA       |
| amount                       | 10000                                                             | Int    | NA       | NA       |
| direction                    | CREDIT, DEBIT                                                     | String | NA       | NA       |
| identification_number        | GwQQOU1BxXM                                                       | String | NA       | NA       |
| receiver_account_type        | CHECKING                                                          | String | NA       | NA       |
| receiver_name                | Rob                                                               | String | NA       | NA       |
| receiver_account_number      | 1111111111                                                        | String | NA       | NA       |
| receiver_routing_number      | 011401533                                                         | String | NA       | NA       |
| settlement_priority          | STANDARD, SAME_DAY                                                | String | NA       | NA       |
| batch_id                     | 209636                                                            | String | NA       | NA       |
| sec_code                     | CCD, PPD, WEB                                                     | String | NA       | NA       |
| company_entry_description    | NA                                                                | String | NA       | NA       |
| fed_trace_number             | 946159018724670                                                   | String | NA       | NA       |
| mass_delivery_id             | 11754329-4329-4129-9665-bccacbd77af0                              | String | NA       | NA       |
| additional_information.key   | As per extra info                                                 | String | NA       | NA       |
| additional_information.value | As per extra info                                                 | String | NA       | NA       |

## Get Particular Transaction

To list down all the Transactions in the svb instance we need to make a **Get** request on the url - 'https://uat.api.svb.com/v2/transfer/domestic-achs/:id' the header parameters will contain -

1. `` Authorization:  `Bearer ${svbLoginToken}`  ``

Path Param will be an _Id_ - `https://uat.api.svb.com/v2/transfer/domestic-achs//69811ffa-7a26-4822-b1a0-a64074de1083`

**Response -**

```json
{
  "effective_entry_date": "2023-01-18",
  "svb_account_number": "1111111111",
  "currency": "USD",
  "company_name": "Caramel Inc",
  "direction": "CREDIT",
  "settlement_priority": "STANDARD",
  "sec_code": "WEB",
  "receiver_account_number": "1111222233330000",
  "receiver_account_type": "CHECKING",
  "receiver_name": "Michael Clarke",
  "receiver_routing_number": "011401533",
  "additional_information": {},
  "amount": 5555536,
  "identification_number": "111115234AB",
  "batch_id": "209636",
  "id": "fbcf983e-034e-4b43-be72-6f4073cfc4b3",
  "status": "SUCCEEDED",
  "fed_trace_number": "045816439973923",
  "mass_delivery_id": "21e4dfd4-3211-4232-8d3b-1a1f8784caad",
  "created_at": "2023-01-17T06:52:49.593731Z",
  "updated_at": "2023-01-19T17:41:02.038165Z",
  "links": []
}
```

## Cancel Payment or update payment

To cancel the payment or update payment status from pending to canceled we need to make a patch request to the url - 'https://uat.api.svb.com/v2/transfer/domestic-verified-achs' the header parameters should contain 2 headers.

1. `` 'Authorization': `Bearer ${svbLoginToken}` ``,
2. `'x-jws-signature': jwsSignature`,

Jws signature should be created by passing payload as below -

```
{
    op: 'replace',
    path: '/status',
    value: 'CANCELED',
},
```

**Request:**

PATCH : 'https://uat.api.svb.com/v2/transfer/domestic-verified-achs/${id}'

we need to pass the payment id as the parameter to the above url.

**Response:**

```
{
    "effective_entry_date": "2023-01-23",
    "svb_account_number": "1111111111",
    "currency": "USD",
    "company_name": "Caramel Inc",
    "direction": "CREDIT",
    "settlement_priority": "STANDARD",
    "sec_code": "WEB",
    "provider_service": "PLAID",
    "provider_id": "processor-sandbox-cf30b4ca-7b1b-41f8-872e-faeb6a79211f",
    "counterparty_name": "Karthik shetty",
    "additional_information": {},
    "amount": 5555537,
    "identification_number": "111115234AB",
    "id": "5bb89c22-830a-4f48-96be-545c786c5ce0",
    "status": "CANCELED",
    "mass_delivery_id": "78993253-20af-4cad-ad74-eee3f6ce81f2",
    "created_at": "2023-01-20T06:43:03.725674Z",
    "updated_at": "2023-01-20T06:43:22.992047Z",
    "links": []
}
```

**References:**

_SVB documentation :_ https://developer.svb.com/apis/getting-started


#
# STRIPE 

![STRIPE]( https://images.ctfassets.net/fzn2n1nzq965/6JEjxpwMd1OIIk6RosReNU/3d5c5f5217a7cce4af750ebfe599b6fc/Payments-social-card.png?q=80)

Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes. Accept payments and scale faster.
Stripe supports both one time payment and subscription model.

## Getting started with stripe
### First Step
To set up a subscription, first, you will need two secret values from the Stripe dashboard.

![Stripe dashboard ]( https://stripe-support-uploads.s3.amazonaws.com/6050469652bc9a2aa6ea39ef25bd4980a723ad2a.png )

For the front end:
```
STRIPE_PUBLISHABLE_KEY
```
For the backend :
```
STRIPE_SECRET_KEY
```
These keys are unique.
Next go to dashboard and create customer and product and not down customerId and productId as they could be used to implement payment using stripe gateway.
[Note:- customers and products can be created through coding and their prices could be set .The below link provides a reference to do the same.

Creating customers :- https://stripe.com/docs/api/customers

Creating products :- https://stripe.com/docs/api/products/create 

Prepare the Backend
First, install the dependency:
```
npm i stripe
```

Then initialize Stripe with your secret key:
```
import Stripe from 'stripe'
const stripe = new Stripe('your_stripe_secret_key')
```

## One time Payment
One time payment on stripe could be achieved by passing the required parameters and obtaining a payment link to stripe gateway.
The below is an example of one time payment implementation using NestJs
### Controller code
```
//One time payment
  @Post("stripe/one-time-transaction")
  @ApiOperation({ summary: 'Initiate a one time transaction' })
  @ApiOkResponse({ description: 'Transaction Initiated Successfully' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiBadRequestResponse({ description: 'Missing parameter '})
  async oneTimeTransaction(@Res() res, @Body() transactionDto: TransactionDto) {
    const result = await this.stripePaymentService.oneTimeTransaction(
      transactionDto
    );
    res.status(HttpStatus.OK).json({
      statusCode: result.statusCode || HttpStatus.OK,
      message: result.message || "Transaction Initiated",
      result: result.url,
      
    });
  }
```
### Service code block
```
//Make an one time payment
  async oneTimeTransaction(transactionDto: TransactionDto) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: transactionDto.priceCode,
            quantity: transactionDto.quantity,
          },
        ],
        mode: "payment",
        payment_intent_data: {
          setup_future_usage: "on_session",
        },
        customer: transactionDto.customerId,
        success_url : process.env.HOST + process.env.SUCCESS_URL,
        cancel_url : process.env.HOST + process.env.CANCEL_URL,
      });

      return session;
    } catch (error) {
      return new HttpException(error.message, error.statusCode);
    }
  }
```
The simple get request should be given as below

**Request:**

POST : 'http://localhost:3000/payment/stripe/one-time-transaction'
```
{
    "priceCode": "price_1MOc3gSHoBF0oHX2J7OdMOX2",
    "quantity": 5,
    "customerId": "cus_N8ttB2ng5s49dM"
}
```
**Response:**

It gives the following response with link which redirects to payment.
```
{
    "statusCode": 200,
    "message": "Transaction Initiated",
    "result": "https://checkout.stripe.com/c/pay/cs_test_a1CNil2aVO56cthIIsSIEXWDWk4wWrSwQseMehrCfp4DHLyzDHkX9JClvh#fidkdWxOYHwnPyd1blpxYHZxWjA0SEpCQVJWTWpHQzVqTV03SDdQb0ZcV1RwdGJKY11iYmI2X1FVVWNCc1V2dEZNYFxXTlU0MlRBRHBTZkFxT3xLV31gQGYzc2NBb0B%2FZEpNM0pGS2FLVGl9NTU8cEdxdEtDQycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
}
```
## Subscription 
Stripe also allows recurring payment which could easily be used in implementing subscription model.
Subscription model uses wide range of parameters providing various functionalities to meet our specific requirements.

Click on this link to know about all the parameters of subscription :-https://stripe.com/docs/api/subscriptions 

The below image shows how subsctription model works.

![STRIPE SUBSCRIPTION MODEL]( https://b.stripecdn.com/docs-statics-srv/assets/abstractions.c0365799e62eac96eed3e9e746e3b65b.svg)

The below is an example for simple stripe implementation for subscription/recurring payment model using NestJs.

### Controller code block.
```
//Subscription payment
  @Post("stripe/subscription")
  @ApiOperation({ summary: 'Initiate subscription' })
  @ApiOkResponse({ description: 'Subscription purchase Successfully initiated' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiBadRequestResponse({ description: 'Missing parameter '})
  async subscription(@Res() res, @Body() subscriptionDto: SubscriptionDto) {
    const result = await this.stripePaymentService.subscription(subscriptionDto);
    
    res.status(HttpStatus.OK).json({
      statusCode: result.statusCode || HttpStatus.OK,
      message: result.message || "Subscription purchase Successfully initiated",
      result: result.url,
      
    });
  }
```
### Service code block.
```
//Purchase an subscription
  async subscription(subscriptionDto: SubscriptionDto) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: subscriptionDto.priceCode, quantity: 1 }],
        mode: "subscription",
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        customer: subscriptionDto.customerId,
        success_url : process.env.HOST + process.env.SUCCESS_URL,
        cancel_url : process.env.HOST + process.env.CANCEL_URL,
      });
      return session;
    } catch (error) {
      return new HttpException(error.message, error.statusCode);
    }
  }
```
The simple get request should be given as below

**Request:**

POST : 'http://localhost:3000/payment/stripe/subscription'
```
{
    "customerId": "cus_N8ttB2ng5s49dM",
    "priceCode": "price_1MPJGUSHoBF0oHX2CvUQ20e6"
    
}
```
**Response:**

It gives the following response with link which redirects to payment.
```
{
    "statusCode": 200,
    "message": "Subscription purchase Successfully initiated",
    "result": "https://checkout.stripe.com/c/pay/cs_test_a1cEQGHedfft42EwUVm3X7cE0TQO8nARToo6KxrVO4WOMc2Di7jAhFox6E#fidkdWxOYHwnPyd1blpxYHZxWjA0SEpCQVJWTWpHQzVqTV03SDdQb0ZcV1RwdGJKY11iYmI2X1FVVWNCc1V2dEZNYFxXTlU0MlRBRHBTZkFxT3xLV31gQGYzc2NBb0B%2FZEpNM0pGS2FLVGl9NTU8cEdxdEtDQycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
}
```

## Errors
Stripe uses conventional HTTP response codes to indicate the success or failure of an API request.

## Sample cards
The below is a list of sample cards that could be used for testing.

![Stripe dashboard ]( https://conference-service.com/doc/images/screenshots/stripe_test_cards.png)


**References:**

_STRIPE documentation :_ https://stripe.com/docs

### Contact for more Info -

1.  Arindam Nath - [arindam.nath@ymedialabs.com]()
2.  Manikant Upadhyay - [manikant.upadhyay@ymedialabs.com]()
3.  Kartik TV - [karthik.tv@ymedialabs.com]()
4.  Kartik SL - [karthik.sl@ymedialabs.com]()
5.  Manjunath Subramanyam - [manjunath.subramanyam@ymedialabs.com]()
6.  Naresh - [naresh.yadulla@ymedialabs.com]()

## License

Nest is [MIT licensed](LICENSE).
