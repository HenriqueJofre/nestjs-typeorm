import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    readonly name: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly address: string;

    @IsString()
    readonly bornDate: Date;

    @IsString({each: true})
    readonly photos: string[];
}
