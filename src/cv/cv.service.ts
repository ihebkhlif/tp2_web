
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Cv } from './entities/cv.entity.js';
import { User } from '../user/entities/user.entity.js';

import { CreateCvDto } from './dto/create-cv.dto.js';
import { UpdateCvDto } from './dto/update-cv.dto.js';

import { Skill } from '../skill/entities/skill.entity.js';
import { AssignSkillsDto } from './dto/assign-skills.dto.js';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const { userId, ...cvData } = createCvDto;

    const cv = this.cvRepository.create({
      ...cvData,
      user: { id: userId } as User,
    });

    return this.cvRepository.save(cv);
  }

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find({
      relations: {'user': true, 'skills': true},
    });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: {'user': true, 'skills': true},
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    return cv;
  }

  async update(
    id: number,
    updateCvDto: UpdateCvDto,
  ): Promise<Cv> {
    const cv = await this.cvRepository.preload({
      id,
      ...updateCvDto,
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    return this.cvRepository.save(cv);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cvRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
  }

  async assignSkills(
  cvId: number,
  assignSkillsDto: AssignSkillsDto,
): Promise<Cv> {
  const cv = await this.cvRepository.findOne({
    where: { id: cvId },
    relations: { user: true, skills: true },
  });

  if (!cv) {
    throw new NotFoundException(`CV with ID ${cvId} not found`);
  }

  const { skillIds } = assignSkillsDto;

  const skills =
    skillIds.length === 0
      ? []
      : await this.skillRepository.findBy({
          id: In(skillIds),
        });

  if (skills.length !== skillIds.length) {
    throw new NotFoundException('One or more skills do not exist');
  }

  cv.skills = skills;

  return this.cvRepository.save(cv);
}
}
