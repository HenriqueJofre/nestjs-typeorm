import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePhotoDto {
    @ApiProperty({
        description: "Photo's url",
        required: true
    })
    @IsString()
    url: string;

    @ApiProperty({
        description: "Photo's userId",
        required: true
    })
    @IsString()
    userId: number;
}
