import {} from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { PaymentModule } from "./payment-services/payment.module";

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
