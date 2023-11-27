import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { transactionDto } from "./dto/stripe/transaction.dto";
import { upgradeSubscriptionDto } from "./dto/stripe/upgradeSubscription.dto";
import { cancelSubscriptionDto } from "./dto/stripe/cancelSubscription.dto";
import { subscriptionDto } from "./dto/stripe/subscription.dto";
import { oneTimeTransactionValidation } from "../validation/oneTimeTransactionValidation";
import { subscriptionValidation } from "src/validation/subscriptionValidation";
import { upgradeSubscriptionValidation } from "src/validation/subscriptionUpgradeValidation";
import { cancelSubscriptionValidation } from "src/validation/cancelSubscriptionValidation";
import { cancelSubscriptionImmediatelyValidation } from "src/validation/cancelSubscriptionImmediatelyValidation";
import { stripeException } from "../exceptions/stripe.exception";
import { createProductDto } from "./dto/stripe/createProduct.dto";
import { createProductValidation } from "../validation/createProductValidation";
import { updatePriceDto } from "./dto/stripe/updatePrice.dto";
import { createPriceDto } from "./dto/stripe/createprice.dto";

// const stripe = require("stripe")(
//   "sk_test_51MOGDWSHoBF0oHX29F8V2F1wKSotptV0vcGzObXy81Pc8frVJxyb3iJICM014454ND0N7k3CQM0SXGfpLtdqd2QY00zS806gyQ"
// );
require("dotenv").config();
const stripe = require("stripe")(
  process.env.YML_PAYMENT_GATEWAY_STRIPE_SECRET_KEY
);

@Injectable()
export class stripePaymentService {
  constructor(
    @Inject("stripePaymentService") private readonly httpService: HttpService
  ) {}

  pass_url = process.env.YML_PAYMENT_GATEWAY_SUCCESS_URL
  //below  reference is for development purpose
    // process.env.YML_PAYMENT_GATEWAY_HOST +
    // process.env.YML_PAYMENT_GATEWAY_SUCCESS_URL;
  fail_url = process.env.YML_PAYMENT_GATEWAY_SUCCESS_URL
    // process.env.YML_PAYMENT_GATEWAY_HOST +
    // process.env.YML_PAYMENT_GATEWAY_CANCEL_URL;

  //Make an one time payment
  async oneTimeTransaction(transactionDto: transactionDto) {
    try {
      let error_message = oneTimeTransactionValidation(transactionDto);
      if (error_message) {
        throw new stripeException(error_message);
      }

      const body = await this.TransactionBody(
        transactionDto.priceCode,
        transactionDto.quantity,
        "payment",
        transactionDto.customerId,
        this.pass_url,
        this.fail_url
      );
      const session = await stripe.checkout.sessions.create(body);

      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  //Purchase an subscription
  async subscription(subscriptionDto: subscriptionDto) {
    try {
      let error_message = subscriptionValidation(subscriptionDto);
      if (error_message) {
        //throw new Error(error_message);
        throw new stripeException(error_message);
      }

      const body = await this.TransactionBody(
        subscriptionDto.priceCode,
        1,
        "subscription",
        subscriptionDto.customerId,
        this.pass_url,
        this.fail_url
      );
      //console.log(body);

      const session = await stripe.checkout.sessions.create(body);
      return session;
    } catch (error) {
      // return new HttpException(error.message, error.status);
      return new stripeException(error.message);
    }
  }

  //Upgrade subscription plan to existing subscription
  async upgradeSubscription(upgradeSubscriptionDto: upgradeSubscriptionDto) {
    try {
      let error_message = upgradeSubscriptionValidation(upgradeSubscriptionDto);
      if (error_message) {
        throw new stripeException(error_message);
      }

      const subscription = await stripe.subscriptions.retrieve(
        upgradeSubscriptionDto.subscriptionId
      );
      const currentPriceId = subscription.items.data[0].price.id;

      if (upgradeSubscriptionDto.priceCode === currentPriceId) {
        throw new Error(
          "The new price must be different from the current price."
        );
      }
      ///-------
      await stripe.subscriptions.del(upgradeSubscriptionDto.subscriptionId);
      const cId = subscription.customer;
      const pcode = upgradeSubscriptionDto.priceCode;
      const body = await this.TransactionBody(
        pcode,
        1,
        "subscription",
        cId,
        this.pass_url,
        this.fail_url
      );
      const session = await stripe.checkout.sessions.create(body);
      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  //Cancel subscription at the end of billing cycle
  async cancelSubscription(cancelSubscriptionDto: cancelSubscriptionDto) {
    try {
      let error_message = cancelSubscriptionValidation(cancelSubscriptionDto);
      if (error_message) {
        throw new stripeException(error_message);
      }
      const session = await stripe.subscriptions.update(
        cancelSubscriptionDto.subscriptionId,
        {
          cancel_at_period_end: true,
        }
      );
      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  //Cancel subscription immediately
  async cancelSubscriptionImmediately(subscriptionId: string) {
    let error_message = cancelSubscriptionImmediatelyValidation();
    if (error_message) {
      throw new Error(error_message);
    }
    try {
      const session = await stripe.subscriptions.del(subscriptionId);

      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  async SuccessSession(Session: any) {
    console.log(Session);
  }
  private async TransactionBody(
    price: string,
    quantity: number,
    mode: string,
    customer: string,
    success_url: string,
    cancel_url: string
  ) {
    return {
      line_items: [{ price: price, quantity: quantity }],
      mode: mode,
      customer: customer,
      success_url: success_url,
      cancel_url: cancel_url,
    };
  }

  //Create product in stripe
  async createProduct(createProductDto: createProductDto) {
    try {
      const products = await stripe.products.list();
      const existingProduct = products.data.find(
        (p) => p.name === createProductDto.productName
      );
      if (existingProduct) {
        return new stripeException("product with this name already present");
      }
      let error_message = createProductValidation(createProductDto);
      if (error_message) {
        throw new stripeException(error_message);
      }
      const session = await stripe.products.create({
        name: createProductDto.productName,
        default_price_data: {
          unit_amount: createProductDto.productPrice,
          currency: "INR",
        },
        expand: ["default_price"],
      });

      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  //update price
  async updateProductPrice(updatePriceDto: updatePriceDto) {
    try {
      const session = await stripe.products.update(updatePriceDto.productId, {
        default_price: updatePriceDto.productPrice,
      });
      return session;
    } catch (error) {
      return new stripeException(error.message);
    }
  }

  //create price
  async createPrice(createPriceDto: createPriceDto) {
    try{
      const priceObj = await stripe.prices.create({
        unit_amount: createPriceDto.productPrice,
        currency: "inr",
  
        product: createPriceDto.productId,
      });
      return priceObj;
    }catch(error){
      return new stripeException(error.message);
    }
    
  }
}
