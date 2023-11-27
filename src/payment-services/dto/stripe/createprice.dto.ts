import { ApiProperty } from "@nestjs/swagger";
export class createPriceDto {
  @ApiProperty({
    description: "productId",
    example: "prod_NOenhyJJ73vpAD",
  })
  readonly productId: string;

  @ApiProperty({
    description: "product price",
    example: "56666",
  })
  readonly productPrice: string;
}