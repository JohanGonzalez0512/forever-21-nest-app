import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { AuthModule } from '../auth/auth.module'; 
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entities/office.entity';

@Module({
  controllers: [OfficesController],
  providers: [OfficesService],
  imports: [
    TypeOrmModule.forFeature([Office]),
    AuthModule
  ],
  exports: [
    OfficesService,
    TypeOrmModule
  ]
})
export class OfficesModule { }
