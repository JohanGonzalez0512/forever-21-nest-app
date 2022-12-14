import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OfficesModule } from './offices/offices.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { StatisticsModule } from './statistics/statistics.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    OfficesModule,
    ProductsModule,
    FilesModule,
    OrdersModule,
    StatisticsModule,
  ],
  providers: [],
})
export class AppModule { }
