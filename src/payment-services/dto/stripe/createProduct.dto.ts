import { ApiProperty } from "@nestjs/swagger";
export class createProductDto {
  @ApiProperty({
    description: "product name",
    example: "audi",
  })
  readonly productName: string;

  @ApiProperty({
    description: "product price",
    example: "100000",
  })
  readonly productPrice: string;
  
 
}