import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';


@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService

  ) { }


  @Get('product/:id')
  findProductImage(
    @Res() res: Response,
    @Param('id') id: string) {
    const path = this.filesService.getStaticProductImage(id);

    res.sendFile(path);
  }


  @Post('product/:id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      filename: fileNamer,
    })
  }))
  uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File ) {


    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    
    return this.filesService.uploadProductImage(id, file);
  }

}
