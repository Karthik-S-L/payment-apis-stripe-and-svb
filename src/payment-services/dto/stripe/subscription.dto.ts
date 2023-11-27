import { ApiProperty } from "@nestjs/swagger";
export class subscriptionDto {
  @ApiProperty({
    description: "price code",
    example: "price_1MPJGUSHoBF0oHX2CvUQ20e6",
  })
  readonly priceCode: string;

  @ApiProperty({
    description: "customer ID",
    example: "cus_N8ttB2ng5s49dM",
  })
  readonly customerId: string;
}