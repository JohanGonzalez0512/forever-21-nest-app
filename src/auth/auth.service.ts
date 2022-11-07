import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Office } from '../offices/entities/office.entity';
import * as bcrypt from "bcryptjs";
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,

    private readonly jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, office: officeId, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        office: { id: officeId },
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }



  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true }
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }



  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }



  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    if (error.code === '23503')
      throw new BadRequestException(error.detail);
    console.log(error)

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }


}
