import { ApiProperty } from "@nestjs/swagger";
export class cancelSubscriptionDto {
  @ApiProperty({
    description: "subscription ID",
    example: "sub_1MQU61SHoBF0oHX2CYof7PwO",
  })
  readonly subscriptionId: string;
}
