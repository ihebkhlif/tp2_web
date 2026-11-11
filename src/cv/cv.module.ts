import { Module } from '@nestjs/common';
import { CvService } from './cv.service.js';
import { CvController } from './cv.controller.js';
import { Cv } from './entities/cv.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skill/entities/skill.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cv,Skill])],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
