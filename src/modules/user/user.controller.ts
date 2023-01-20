import { Controller, Get, Post, Delete, Req, Res, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiTags('user')
  @ApiBody({
    required: true,
    type: CreateUserDto
  })
  @ApiResponse({ status: 200, description: "The user was registered!"})
  @ApiResponse({ status: 201, description: "The user was registered!"})
  @ApiResponse({ status: 403, description: "This user already exists!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  async create(@Req() req: Request, @Res() res: Response) {
    return this.userService.create(req, res);
  }

  @Get()
  @ApiTags('user')
  @ApiResponse({
    description: "It will return an array that contain a value or values with JSON",
    type: [CreateUserDto]
  })
  @ApiResponse({ status: 200, description: "The users were encountered!"})
  @ApiResponse({ status: 404, description: "There no users registered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  async findAll(@Req() req: Request, @Res() res: Response) {
    return this.userService.findAll(res, req);
  }

  @Get(':id')
  @ApiTags('user')
  @ApiParam({
    name: ':id',
    description: "User's id to seek"
  })
  @ApiResponse({
    description: "It will return an array that contain a value with JSON",    
    type: [CreateUserDto]
  })
  @ApiResponse({ status: 200, description: "The user was encountered!"})
  @ApiResponse({ status: 404, description: "These user wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  async findOne(@Req() req: Request, @Res() res: Response) {
    return this.userService.findOne(req, res);
  }

  @Put(':id')
  @ApiTags('user')
  @ApiParam({
    name: ':id',
    description: "User's id to update info!"
  })
  @ApiResponse({ status: 200, description: "The user was updated!"})
  @ApiResponse({ status: 404, description: "These user wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  update(@Req() req: Request, @Res() res: Response) {
    return this.userService.update(req, res);
  }

  @Delete(':id')
  @ApiTags('user')
  @ApiParam({
    name: ':id',
    description: "User's id to remove!"
  })
  @ApiResponse({ status: 200, description: "The user was removed!"})
  @ApiResponse({ status: 404, description: "These user wasn't encountered!"})
  @ApiResponse({ status: 500, description: "Internal server error"})
  remove(@Req() req: Request, @Res() res: Response) {
    return this.userService.remove(req, res);
  }
}
