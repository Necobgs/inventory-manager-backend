import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { CategoryModule } from './domain/category/category.module';
import { InventoryModule } from './domain/inventory/inventory.module';
import { MovementModule } from './domain/movement/movement.module';
import { join } from 'path';
import { SupplierModule } from './domain/supplier/supplier.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
       envFilePath: '.env',
       validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSW: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required()
       })
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService)=>({
        type:'postgres',
        host:configService.get('DB_HOST')!,
        port:+configService.get('DB_PORT')!,
        username:configService.get('DB_USER')!,
        password:configService.get('DB_PASSW')!,
        database:configService.get('DB_DATABASE')!,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      })
    }),
    UserModule, AuthModule, CategoryModule, InventoryModule, MovementModule, SupplierModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}