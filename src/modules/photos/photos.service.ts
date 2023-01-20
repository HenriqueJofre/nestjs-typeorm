import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Request, Response } from 'express';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(req: Request, res: Response) {
    const CreatePhotoDto:CreatePhotoDto = req.body;
    
    try {

      const _createPhoto = await this.photoRepository.insert({...CreatePhotoDto});      
      
      if(_createPhoto.raw[0]){
        return res.status(HttpStatus.OK).json({message: 'The user was registered!'});
      }    
      
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const _resPhotos = await this.photoRepository.findBy({
        user: Raw((alias) => `${alias} = :id`, { id: id }),
      });

      if(_resPhotos.length > 0){
        return res.status(HttpStatus.OK).json(_resPhotos);
      }

      return res.status(HttpStatus.NOT_FOUND).json({message: 'There no photos registered!'});
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const _resPhotos = await this.photoRepository.findOne({
        where: {
          id
        },
      });

      if(_resPhotos){
        return res.status(HttpStatus.OK).json(_resPhotos);
      }

      return res.status(HttpStatus.NOT_FOUND).json({message: "The photo wasn't encountered!"});
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const UpdatePhotoDto:UpdatePhotoDto = req.body;

    try {
      const _up = await this.photoRepository.update(id, UpdatePhotoDto)
      if(_up.affected > 0){
        return res.status(HttpStatus.OK).json({message: "The photo was updated!"});
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const _findPhoto = await this.photoRepository.findOne({
        where: {
          id
        }
      });

      if(!_findPhoto){
        return res.status(HttpStatus.NOT_FOUND).json({message: "The photo wasn't encountered!"});
      }

      const _remove = await this.photoRepository.createQueryBuilder('Photo')
      .delete()
      .from(Photo)
      .where("id = :id", { id })
      .execute();
      if(_remove.affected > 0){
        return res.status(HttpStatus.NOT_FOUND).json({message: "The photo was removed!"});
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
