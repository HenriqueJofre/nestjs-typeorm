import { IsString } from 'class-validator';

export class CreateUserDto {
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