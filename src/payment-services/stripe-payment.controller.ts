import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { transactionDto } from "./dto/stripe/transaction.dto";
import { stripePaymentService } from "./stripe-payment.service";
import { subscriptionDto } from "./dto/stripe/subscription.dto";
import { upgradeSubscriptionDto } from "./dto/stripe/upgradeSubscription.dto";
import { cancelSubscriptionDto } from "./dto/stripe/cancelSubscription.dto";
import { query } from "express";
import { createProductDto } from "./dto/stripe/createProduct.dto";
import { updatePriceDto } from "./dto/stripe/updatePrice.dto";

@Controller("payments")
@ApiTags("stripe-payment-apis")
export class stripePaymentController {
  constructor(
    @Inject("stripePaymentService")
    private readonly stripePaymentService: stripePaymentService
  ) {}

  //One time payment
  @Post("one-time-transaction")
  @ApiOperation({ summary: "Initiate a one time transaction" })
  @ApiOkResponse({ description: "Transaction Initiated Successfully" })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async oneTimeTransaction(@Res() res, @Body() transactionDto: transactionDto) {
    const result = await this.stripePaymentService.oneTimeTransaction(
      transactionDto
    );
    if (result.status == "open") {
      result.status = 200;
    }
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "Transaction Initiated",
      result: result.url,
    });
  }

  //Subscription payment
  @Post("subscription")
  @ApiOperation({ summary: "Initiate subscription" })
  @ApiOkResponse({
    description: "Subscription purchase Successfully initiated",
  })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async subscription(@Res() res, @Body() subscriptionDto: subscriptionDto) {
    const result = await this.stripePaymentService.subscription(
      subscriptionDto
    );
    if (result.status == "open") {
      result.status = 200;
    }

    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "Subscription purchase Successfully initiated",
      result: result.url,
    });
  }

  //Subscription payment
  @Patch("upgrade-subscription")
  @ApiOperation({ summary: "Initiate subscription upgrade" })
  @ApiOkResponse({ description: "Subscription upgrade Successfully initiated" })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async upgradeSubscription(
    @Res() res,
    @Body() upgradeSubscriptionDto: upgradeSubscriptionDto
  ) {
    const result = await this.stripePaymentService.upgradeSubscription(
      upgradeSubscriptionDto
    );
    if (result.status == "open") {
      result.status = 200;
    }

    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "Subscription Upgrade Initiated Successfully",
      result: result.url,
    });
  }

  @Patch("cancel-subscription")
  @ApiOperation({ summary: "Cancel subscription at the end of billing cycle" })
  @ApiOkResponse({ description: "Subscription cancelled Successfully " })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async cancelSubscription(
    @Res() res,
    @Body() cancelSubscriptionDto: cancelSubscriptionDto
  ) {
    const result = await this.stripePaymentService.cancelSubscription(
      cancelSubscriptionDto
    );
    if (result.status == "active") {
      result.status = 200;
    }
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message:
        result.message || "Subscription cancelled from next billing cycle",
    });
  }

  @Patch("cancel-subscription-immediately/:subscriptionId")
  @ApiOperation({ summary: "Cancel subscription at the end of billing cycle" })
  @ApiOkResponse({ description: "Subscription cancelled Successfully " })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async cancelSubscriptionImmediately(
    @Res() res,
    @Param("subscriptionId") subscriptionId: string
  ) {
    const result =
      await this.stripePaymentService.cancelSubscriptionImmediately(
        subscriptionId
      );
    if (result.status == "canceled") {
      result.status = 200;
    }
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message:
        result.message ||
        "Subscription cancelled Successfully ,coming to effect immediately",
    });
  }

  @Post("create-product")
  @ApiOperation({ summary: "Create a product" })
  @ApiOkResponse({
    description: "Product created successfully",
  })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async createProduct(@Res() res, @Body() createProductDto: createProductDto) {
    const result = await this.stripePaymentService.createProduct(createProductDto);
    
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "product created succesfully" ,
    });
  }

  @Patch("update-product-price")
  @ApiOperation({ summary: "update price of a  a product" })
  @ApiOkResponse({
    description: "Price updated  successfully",
  })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async updateProductPrice(@Res() res, @Body() updatePriceDto:updatePriceDto) {
    const result = await this.stripePaymentService.updateProductPrice(updatePriceDto);
    
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "price updated succesfully" ,
    });
  }

  @Post("create-price")
  @ApiOperation({ summary: "created price" })
  @ApiOkResponse({
    description: "Price created successfully",
  })
  @ApiInternalServerErrorResponse({ description: "Server Error" })
  @ApiBadRequestResponse({ description: "Missing parameter " })
  async createPrice(@Res() res, @Body() updatePriceDto:updatePriceDto) {
    const result = await this.stripePaymentService.createPrice(updatePriceDto);
    
    res.status(HttpStatus.OK).json({
      statusCode: result.status || HttpStatus.OK,
      message: result.message || "price created succesfully" ,
    });
  }

  @Get("pay/success/checkout/session")
  paymentSuccess(@Res({ passthrough: true }) res) {
    return this.stripePaymentService.SuccessSession(res);
  }
}
