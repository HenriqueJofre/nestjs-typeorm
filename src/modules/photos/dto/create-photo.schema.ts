import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePhotoSchema {
    @ApiProperty({
        description: "Photo's url",
        required: true
    })
    @IsString()
    url: string;

    @ApiProperty({
        description: "Photo's user Id",
        required: true
    })
    @IsString()
    user: number;
}
