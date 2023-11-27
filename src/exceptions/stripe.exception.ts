import { BadRequestException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";

export class stripeException extends BadRequestException {
  constructor(public message:string) {
    super(`${message}`);
  }
}

