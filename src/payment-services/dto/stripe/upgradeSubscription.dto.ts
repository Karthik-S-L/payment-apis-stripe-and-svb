import { ApiProperty } from "@nestjs/swagger";
export class upgradeSubscriptionDto {
  @ApiProperty({
    description: "price code",
    example: "price_1MQBYfSHoBF0oHX2p59v0YRp",
  })
  readonly priceCode: string;

  @ApiProperty({
    description: "subscription ID",
    example: "sub_1MWBXWSHoBF0oHX2yQF7tJMY",
  })
  readonly subscriptionId: string;
  
}
