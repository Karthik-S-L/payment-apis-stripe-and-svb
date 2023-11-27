import { Module } from "@nestjs/common";
import { SvbPaymentController } from "./svb-payment.controller";
import { stripePaymentService } from "./stripe-payment.service";
import { SvbPaymentService } from "./svb-payment.service";
import { ConfigModule } from "@nestjs/config";
import { HttpModule, HttpService } from "@nestjs/axios";
import { stripePaymentController } from "./stripe-payment.controller";
import { ConfigService } from '@nestjs/config';

// Factory method which conditionally checks SVB Service to be initialized
const serviceFactorySVB = {
  provide: "SVBPaymentService",
  useFactory: (httpService: HttpService, configService: ConfigService) => {
    if (process.env.YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER.indexOf("SVB") > -1) {
      return new SvbPaymentService(httpService);
    }
  },
  inject: [HttpService, ConfigService],
};

// Factory method which conditionally checks the Services to be invoked on the app init!!
const serviceFactoryStripe = {
  provide: "stripePaymentService",
  useFactory: (httpService: HttpService) => {
    if (process.env.YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER.indexOf("STRIPE") > -1) {
      return new stripePaymentService(httpService);
    }
  },
  inject: [HttpService],
};

// Factory method which will conditionally initialize controllers according to array of
// payment services available or enabled
const controllerFactory = () => {
  const controllers: Array<any> = [];
  if (process.env.YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER.indexOf("SVB") > -1) {
    controllers.push(SvbPaymentController);
  }
  if (process.env.YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER.indexOf("STRIPE") > -1) {
    controllers.push(stripePaymentController);
  }
  return controllers;
};
@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [...controllerFactory()],
  providers: [serviceFactorySVB, serviceFactoryStripe],
})
export class PaymentModule { }
