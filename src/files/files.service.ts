import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        configService: ConfigService

    ) {
        cloudinary.config({
            api_key: configService.get('CLOUDINARY_API_KEY'),
            api_secret: configService.get('CLOUDINARY_API_SECRET'),
            cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        }
        )
    }



    getStaticProductImage(id: string) {
        const path = join(__dirname, '../../static/products', id);

        if (!existsSync(path))
            throw new BadRequestException('Product image not found');

        return path;
    }

    async uploadProductImage(id: string, file: Express.Multer.File) {

        // TODO: Save file path to database
        // TODO: Check if the id exists in the database
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        const result = await cloudinary.uploader.upload(file.path, options);



        return {
            result: result.url
        }
        this.productRepository.update(id, { imageURL: file.filename });
    }

}
