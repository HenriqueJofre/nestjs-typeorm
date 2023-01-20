import { Controller, Get, Post, Delete, Req, Res, Put } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoSchema} from './dto/create-photo.schema';
import { PhotoReturnType } from './dto/photo-return.type';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';


@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiTags('photos')
  @ApiBody({
    required: true,
    type: CreatePhotoSchema
  })
  @ApiResponse({ status: 200, description: "The photo was registered!"})
  @ApiResponse({ status: 201, description: "The photo was registered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  create(@Req() req: Request, @Res() res: Response) {
    return this.photosService.create(req, res);
  }

  @Get('all/:id')
  @ApiTags('photos')
  @ApiParam({
    name: ':id',
    description: "Photo's user id"
  })
  @ApiResponse({
    description: "It will return an array that contain a value or values with JSON",    
    type: [PhotoReturnType]
  })
  @ApiResponse({ status: 200, description: "The user was encountered!"})
  @ApiResponse({ status: 404, description: "There no photos registered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  findAll(@Req() req: Request, @Res() res: Response) {
    return this.photosService.findAll(req, res);
  }

  @Get(':id')
  @ApiTags('photos')
  @ApiParam({
    name: ':id',
    description: "Photo's id to seek"
  })
  @ApiResponse({
    description: "It will return an array that contain a value with JSON",    
    type: PhotoReturnType
  })
  @ApiResponse({ status: 200, description: "The photo was encountered!"})
  @ApiResponse({ status: 404, description: "The photo wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  findOne(@Req() req: Request, @Res() res: Response) {
    return this.photosService.findOne(req, res);
  }

  @Put(':id')
  @ApiTags('photos')
  @ApiParam({
    name: ':id',
    description: "Photo's id to update info!"
  })
  @ApiResponse({ status: 200, description: "The photo was updated!"})
  @ApiResponse({ status: 404, description: "The photo wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  update(@Req() req: Request, @Res() res: Response) {
    return this.photosService.update(req, res);
  }

  @Delete(':id')
  @ApiTags('photos')
  @ApiParam({
    name: ':id',
    description: "Photo's id to remove!"
  })
  @ApiResponse({ status: 200, description: "The photo was removed!"})
  @ApiResponse({ status: 404, description: "The photo wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  remove(@Req() req: Request, @Res() res: Response) {
    return this.photosService.remove(req, res);
  }
}
