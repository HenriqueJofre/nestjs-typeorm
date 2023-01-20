import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';

import { Photo } from '../../photos/entities/photo.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  bornDate: Date;

  @OneToMany(() => Photo, (photo) => photo.user, {
    cascade: true
  })
  photos?: Photo[];
}
