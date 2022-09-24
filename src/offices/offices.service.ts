import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfficeDto } from './dto/create-office.dto';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficesService {

  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) { }


  async create(createOfficeDto: CreateOfficeDto) {

    try {

      const office = this.officeRepository.create(createOfficeDto);
      await this.officeRepository.save(office);

      return office;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {   
      const offices = this.officeRepository.find();
      return offices;

  }

  async findOne(id: string) {
    const office = await this.officeRepository.findOneBy({ id });
    return office;
  }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    console.log(error)

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
