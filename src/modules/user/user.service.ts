import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Photo } from '../photos/entities/photo.entity';
import { User } from './entities/user.entity';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(req: Request, res: Response) {
    const createUserDto:CreateUserDto = req.body;
    
    try {
      const user = await this.userRepository.findBy({
        email: Raw((alias) => `${alias} = :email`, { email: createUserDto.email }),
      });     

      if(user.length > 0){
        return res.status(HttpStatus.FORBIDDEN).json({message: 'This user already exists!'});
      }

      const photos = await Promise.all(
        createUserDto.photos.map((url) => this.createPhoto(url)),
      );

      const saveUser = this.userRepository.create({
        ...createUserDto,
        photos,
      });
      const saved = await this.userRepository.save(saveUser);
      const count = Object.keys(saved).length;
      if(count > 0){
        return res.status(HttpStatus.OK).json({message: 'The user was registered!'});
      }     
      
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(res: Response, req?: Request) {
    try {
      const _resPhotos = await this.userRepository.find({
        relations: ['photos']
      });

      if(Object.keys(_resPhotos).length > 0){
        return res.status(HttpStatus.OK).json(_resPhotos);
      }

      return res.status(HttpStatus.NOT_FOUND).json({message: 'There no users registered!'});
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }

  async findOne(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id);
    
      const _resUser = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['photos']
      });
      
      if (!_resUser) {
        return res.status(HttpStatus.NOT_FOUND).json({message: "These user wasn't encountered!"});
      }

      return res.status(HttpStatus.OK).json(_resUser);
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }

  async update(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const updateUserDto:UpdateUserDto = req.body;

    try {
      const photos = updateUserDto.photos && (await Promise.all(
        updateUserDto.photos.map((name) => this.createPhoto(name)),
      ));

      const User = await this.userRepository.preload({
        id: +id,
        ...updateUserDto,
        photos,
      });

      if (!User) {
        return res.status(HttpStatus.NOT_FOUND).json({message: "These user wasn't encountered!"});
      }
      const _up = await this.userRepository.update(id, User)
      if(_up.affected > 0){
        return res.status(HttpStatus.OK).json({message: "The user was updated!"});
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const findUser = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['photos']
      });

      if(!findUser){
        return res.status(HttpStatus.NOT_FOUND).json({message: "These user wasn't encountered!"});
      }

      this.userRepository.createQueryBuilder('Photo')
      .delete()
      .from(Photo)
      .where("userId = :userId", { userId: id })
      .execute();

      const _remove = await this.userRepository.createQueryBuilder('User')
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
      if(_remove.affected > 0){
        return res.status(HttpStatus.NOT_FOUND).json({message: "The user was removed!"});
      }
      
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createPhoto(url: string): Promise<Photo>{
    return this.photoRepository.create({ url });
  }
}
