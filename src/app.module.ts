import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PhotosModule } from './modules/photos/photos.module';

@Module({
  imports: [    
    ConfigModule.forRoot({
      envFilePath: [`./config/env/${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [
          __dirname + '/modules/**/entities/*.entity{.ts,.js}',
        ],
        synchronize: (process.env.NODE_ENV === "development" ? true : false) // Synchronize prop indicates if database schema should be auto created on every application launch
      })
    }),
    UserModule,
    PhotosModule,           
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
