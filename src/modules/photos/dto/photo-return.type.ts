import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PhotoReturnType {
    @ApiProperty({
        description: "Photo's Id",
        required: true
    })
    @IsString()
    id: number;

    @ApiProperty({
        description: "Photo's url",
        required: true
    })
    @IsString()
    url: string;    
}
