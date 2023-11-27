import { ApiProperty } from "@nestjs/swagger";
export class updatePriceDto {
  @ApiProperty({
    description: "productId",
    example: "prod_NOenhyJJ73vpAD",
  })
  readonly productId: string;

  @ApiProperty({
    description: "product price",
    example: "price_1MdrTxSHoBF0oHX2Pz6a52xY",
  })
  readonly productPrice: string;
}