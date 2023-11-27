import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SvbPaymentService } from './svb-payment.service';
import { Patch, Query } from '@nestjs/common/decorators';
import { ListAllTransactionsDto } from './dto/svb/list-all-transaction.dto';
import { TriggerPaymentDto } from './dto/svb/triggerPayment.dto';
@Controller('payments')
@ApiTags('svb-apis')
export class SvbPaymentController {
  constructor(
    @Inject('SVBPaymentService')
    private readonly svbPaymentService?: SvbPaymentService,
  ) { }
  // Retrieve all transactions associated to the SVB Instance (Bucket)
  // @Get('/get-all-transactions')
  // async getAllTransactions(
  //   @Query() listTransactionQueryParams: ListAllTransactionsDto,@Res() res){
  //   res.status(200).send(await this.svbPaymentService.getAllTransactions(listTransactionQueryParams));
  // }
  @Get("/get-all-transactions")
  async getAllTransactions(
    @Query() listTransactionQueryParams: ListAllTransactionsDto,
    @Res() res?: any
  ): Promise<void> {
    return this.svbPaymentService.getAllTransactions(
      listTransactionQueryParams,
      res
    );
  }
  // Retrieve transaction based on ID Provided
  @Get('/get-transaction/:id')
  async getTranSpecificTransaction(
    @Param('id')
    id: string,
    @Res() res,
  ) {
    res.status(200).send(await this.svbPaymentService.getSpecificTransaction(id))
    // return this.svbPaymentService.getSpecificTransaction(id);
  }
  //This method is used to trigger the SVB payments using access token and JWS signature
  @Post('/trigger-payment')
  async triggerPayment(@Body() body: TriggerPaymentDto, @Res() res) {
    res.status(201).send(await this.svbPaymentService.submitSVBTransferRequest(body));
  }
  //This method is used to cancel the SVB payments
  @Patch('cancel-payment/:id')
  async cancelPayment(@Param('id') id: string, @Res() res) {
    res.status(200).send(await this.svbPaymentService.cancelSVBTransfer(id, res));
  }
}