import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { GridFsMulterConfigService } from './multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [GridFsMulterConfigService, FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
