import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
    /* The ApiProperty decorator contain many options to define, choice that you wish */

    @ApiProperty({
        description: "User's name",
        required: true
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: "User's email",
        required: true
    })
    @IsString()
    readonly email: string;

    @ApiProperty({
        description: "User's password",
        required: true
    })
    @IsString()
    readonly password: string;

    @ApiProperty({
        description: "User's address",
        required: true
    })
    @IsString()
    readonly address: string;

    @ApiProperty({
        description: "User's born date",
        required: true
    })
    @IsString()
    readonly bornDate: Date;

    @ApiProperty({
        description: "User's photos",
        required: true
    })
    @IsString({each: true})
    readonly photos?: string[];
}