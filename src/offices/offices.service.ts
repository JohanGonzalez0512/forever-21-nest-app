import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
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
    return `This action returns all offices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} office`;
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    console.log(error)

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
