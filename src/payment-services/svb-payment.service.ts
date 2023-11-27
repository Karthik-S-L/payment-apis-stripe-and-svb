import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import * as jws from "jws";
import * as uuid from "uuid";
import axios from "axios";
import { ListAllTransactionsDto } from "./dto/svb/list-all-transaction.dto";
import { TriggerPaymentDto } from "./dto/svb/triggerPayment.dto";
@Injectable()
export class SvbPaymentService {
  constructor(
    @Inject("SVBPaymentService") private readonly httpService?: HttpService
  ) { }
  private async authenticateSVB(): Promise<string> {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("scope", "ach");
    const credentialsBuffer = Buffer.from(
      `${process.env.YML_PAYMENT_GATEWAY_SVB_CLIENT_ID}:${process.env.YML_PAYMENT_GATEWAY_SVB_CLIENT_SECRET}`
    );
    try {
      const { data }: any = await lastValueFrom(
        this.httpService.post(
          String(process.env.YML_PAYMENT_GATEWAY_SVB_AUTHENTICATION_URL),
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${credentialsBuffer.toString("base64")}`,
            },
          }
        )
      );
      return data?.access_token;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status || HttpStatus.FORBIDDEN,
        },
        error?.response?.status || HttpStatus.FORBIDDEN,
        {
          cause: error?.response?.data?.error_description || error.message,
        }
      );
    }
  }
  private async generateJWS(requestBody): Promise<string> {
    try {
      const jwsToken = jws.sign({
        header: {
          alg: "HS256",
          kid: uuid.v4(),
          typ: "JOSE",
        },
        payload: requestBody,
        secret: process.env.YML_PAYMENT_GATEWAY_SVB_CLIENT_SECRET,
      });
      const splitted = jwsToken.split(".");
      const detachedJWT = splitted[0] + ".." + splitted[2];
      return detachedJWT;
    } catch (error) {
      return error;
    }
  }
  /**
   * This method retrieves all the transaction based on Query Params, Also the default limit is 1000
   * & the default offset is 1 in case no query param is sent
   * @param params - Query Params from the Request
   * @param res - The response from the SVB Server
   */
  // async getAllTransactions(
  //   params: ListAllTransactionsDto
  // ) {
  //   try {
  //     const svbLoginToken = await this.authenticateSVB();
  //     const allTransactions = await axios.get(process.env.YML_PAYMENT_GATEWAY_SVB_BASE_API_URL, {
  //       params: params,
  //       headers: {
  //         Authorization: `Bearer ${svbLoginToken}`,
  //         prefer: process.env.YML_PAYMENT_GATEWAY_GET_ALL_TRANSACTIONS_PREFERENCE,
  //       },
  //     });
  //     return allTransactions.data
  //   } catch (e) {
  //     return e?.response?.data
  //   }
  // }
  async getAllTransactions(
    params: ListAllTransactionsDto,
    res: { send: (arg0: any) => void }
  ) {
    console.log(process.env.YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER.indexOf("SVB"));

    try {
      const svbLoginToken = await this.authenticateSVB();
      const allTransactions = await axios.get(process.env.YML_PAYMENT_GATEWAY_SVB_BASE_API_URL, {
        params: params,
        headers: {
          Authorization: `Bearer ${svbLoginToken}`,
          prefer: process.env.YML_PAYMENT_GATEWAY_GET_ALL_TRANSACTIONS_PREFERENCE,
        },
      });
      res.send(allTransactions.data);
    } catch (e) {
      res.send(e.response.data);
    }
  }
  async getSpecificTransaction(id: string) {
    try {
      const svbLoginToken = await this.authenticateSVB();
      const transaction = await axios.get(
        process.env.YML_PAYMENT_GATEWAY_SVB_BASE_API_URL + `/${id}`,
        {
          headers: {
            Authorization: `Bearer ${svbLoginToken}`,
          },
        }
      );
      return transaction.data
    } catch (e) {
      return e.response.data
    }
  }
  async submitSVBTransferRequest(PAYLOAD: TriggerPaymentDto) {
    try {
      const svbLoginToken = await this.authenticateSVB();
      const jwsSignature = await this.generateJWS(PAYLOAD);
      const achTransfer = await axios.post(
        process.env.YML_PAYMENT_GATEWAY_SVB_TRANSFER_URL,
        PAYLOAD,
        {
          headers: {
            Authorization: `Bearer ${svbLoginToken}`,
            "x-jws-signature": jwsSignature,
            prefer: "RETURN_REPRESENTATION",
          },
        }
      );
      // console.log("output",achTransfer?.data?.results[0]);
      // res.send(achTransfer?.data?.results[0]);
      return achTransfer?.data?.results[0]
    } catch (error) {
      //res.send(error?.response?.data);
      // console.log(error);
      throw new HttpException(error?.response?.data, error.response.status)
    }
  }
  async cancelSVBTransfer(id, res) {
    try {
      const svbLoginToken = await this.authenticateSVB();
      const jwsSignature = await this.generateJWS([
        {
          op: "replace",
          path: "/status",
          value: "CANCELED",
        },
      ]);
      const cancelAchTransfer = await axios.patch(
        process.env.YML_PAYMENT_GATEWAY_SVB_TRANSFER_URL + "/" + `${id}`,
        [
          {
            op: "replace",
            path: "/status",
            value: "CANCELED",
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${svbLoginToken}`,
            "x-jws-signature": jwsSignature,
            prefer: "RETURN_REPRESENTATION",
          },
        }
      );
      // res.json({ "status": cancelAchTransfer?.data['status’] })
      // console.log(cancelAchTransfer?.data);
      // res.json( cancelAchTransfer?.data)
      return cancelAchTransfer?.data
    } catch (error) {
      return error?.response?.data;
    }
  }
}