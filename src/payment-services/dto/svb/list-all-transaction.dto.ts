import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

enum STATUS {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  PROCESSING = "PROCESSING",
  HOLD = "HOLD",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CORRECTED = "CORRECTED",
}

enum DIRECTION {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

enum SETTLEMENT {
  STANDARD = "STANDARD",
  SAME_DAY = "SAME_DAY",
}

enum SEC_CODE {
  CCD = "CCD",
  PPD = "PPD",
  WEB = "WEB",
}
export class ListAllTransactionsDto {
  @ApiPropertyOptional()
  @ApiProperty({
    minimum: 1,
    format: "int32",
  })
  offset?: number;

  @ApiPropertyOptional()
  @ApiProperty({
    minimum: 1,
    maximum: 10000,
    format: "int32",
  })
  limit?: number;

  @ApiPropertyOptional()
  @ApiProperty({})
  effective_entry_date?: Date;
  @ApiPropertyOptional()
  @ApiProperty({
    enum: STATUS,
  })
  status?: STATUS[];

  @ApiPropertyOptional()
  @ApiProperty({})
  svb_account_number?: string;
  @ApiPropertyOptional()
  @ApiProperty({})
  amount?: number;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: DIRECTION,
  })
  direction?: DIRECTION[];

  @ApiPropertyOptional()
  @ApiProperty({})
  identification_number?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  receiver_account_type?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  receiver_name?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  receiver_account_number?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  receiver_routing_number?: string;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: SETTLEMENT,
  })
  settlement_priority?: SETTLEMENT[];

  @ApiPropertyOptional()
  @ApiProperty({})
  batch_id?: string;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: SEC_CODE,
  })
  sec_code?: SEC_CODE[];

  @ApiPropertyOptional()
  @ApiProperty({})
  company_entry_description?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  fed_trace_number?: string;

  @ApiPropertyOptional()
  @ApiProperty({})
  mass_delivery_id?: string;
}
