import { ApiProperty } from "@nestjs/swagger";
export class transactionDto {
  @ApiProperty({
    description: "price code",
    example: "price_1MOc3gSHoBF0oHX2J7OdMOX2",
  })
  readonly priceCode: string;

  @ApiProperty({
    description: "quantity of product",
    example: "3",
  })
  readonly quantity: number;

  @ApiProperty({
    description: "customer ID",
    example: "cus_N8ttB2ng5s49dM",
  })
  readonly customerId: string;
}
