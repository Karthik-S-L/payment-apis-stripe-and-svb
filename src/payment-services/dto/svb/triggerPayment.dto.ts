import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNumber,
    IsString,
    isString,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
class batch_details {
    @IsString()
    @ApiProperty({
        description: 'svb_account_number',
        example: '1111111111',
        required: true,
    })
    readonly svb_account_number: string;
    @IsString()
    @ApiProperty({
        description: 'direction',
        example: 'CREDIT',
        required: true,
    })
    readonly direction: string;
    @IsString()
    @ApiProperty({
        description: 'sec_code',
        example: 'WEB',
        required: true,
    })
    readonly sec_code: string;
}
class transfers {
    @IsNumber()
    @ApiProperty({
        description: 'amount',
        example: 5555537,
        required: true,
    })
    readonly amount: Number;
    @IsString()
    @ApiProperty({
        description: 'identification_number',
        example: '111115234AB',
        required: true,
    })
    readonly identification_number: string;
    @IsString()
    @ApiProperty({
        description: 'counterparty_name',
        example: 'Michael Clarke',
        required: true,
    })
    readonly counterparty_name: string;
    @IsString()
    @ApiProperty({
        description: 'provider_service',
        example: 'PLAID',
        required: true,
    })
    readonly provider_service: string;
    @IsString()
    @ApiProperty({
        description: 'provider_id',
        example: 'processor-sandbox-cf30b4ca-7b1b-41f8-872e-faeb6a79211f',
        required: true,
    })
    readonly provider_id: string;
}
export class TriggerPaymentDto {
    @Type(() => batch_details)
    @ValidateNested()
    @ApiProperty({
        required: true,
        type: () => batch_details,
    })
    batch_details: batch_details;
    @Type(() => transfers)
    @ValidateNested()
    @ApiProperty({
        required: true,
        type: () => [transfers],
    })
    transfers: transfers;
}