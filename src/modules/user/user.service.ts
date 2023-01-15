import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Photo } from './entities/photo.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.findBy({
        email: Raw((alias) => `${alias} = :email`, { email: createUserDto.email }),
      });     

      if(user.length > 0){
        return {
          codeType: 1,
          message: 'This user already exists!'
        }
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
        return {
          codeType: 2,
          message: 'The user was registered!'
        }
      }     
      
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    try {
      return this.userRepository.find({
        relations: ['photos']
      });
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }

  async findOne(id: number) {    
    const User = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['photos']
    });
    
    if (!User) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return User;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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
        throw new NotFoundException(`User ID ${id} not found`);
      }

      return this.userRepository.save(User);

    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const findUser = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['photos']
      });

      if(!findUser){
        return `The user doesn't was encountered!`
      }

      this.userRepository.createQueryBuilder('Photo')
      .delete()
      .from(Photo)
      .where("userId = :userId", { userId: id })
      .execute();

      return this.userRepository.createQueryBuilder('User')
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createPhoto(url: string): Promise<Photo>{
    return this.photoRepository.create({ url });
  }
}
