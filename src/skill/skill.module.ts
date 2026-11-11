import { Module } from '@nestjs/common';
import { SkillService } from './skill.service.js';
import { SkillController } from './skill.controller.js';
import { Skill } from './entities/skill.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
