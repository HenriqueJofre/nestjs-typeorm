import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePhotoDto } from './create-photo.dto';

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {
    @ApiProperty({
        description: "Photo's url",
        required: true
    })
    @IsString()
    readonly url: string;
}
