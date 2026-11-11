
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from '../app.module.js';
import { UserService } from '../user/user.service.js';
import { CvService } from '../cv/cv.service.js';
import { SkillService } from '../skill/skill.service.js';
import { Cv } from '../cv/entities/cv.entity.js';
import { User } from '../user/entities/user.entity.js';

import {
  randFirstName,
  randLastName,
  randJobTitle,
} from '@ngneat/falso';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const cvService = app.get(CvService);
    const skillService = app.get(SkillService);

    const cvRepository = app.get<Repository<Cv>>(
      getRepositoryToken(Cv),
    );

    console.log('Starting database seeding...');

    // 1. Create skills
    const skillNames = [
      'Java',
      'Python',
      'JavaScript',
      'TypeScript',
      'Angular',
      'React',
      'NestJS',
      'SQL',
      'Machine Learning',
      'Docker',
    ];

    const skills: Awaited<ReturnType<typeof skillService.create>>[] = [];

    for (const designation of skillNames) {
      const skill = await skillService.create({ designation });
      skills.push(skill);
    }

    console.log(`${skills.length} skills created.`);

    // 2. Create users and their CVs
    for (let i = 1; i <= 5; i++) {
      const firstname = randFirstName();
      const name = randLastName();

      const user = await userService.create({
        username: `user_${i}`,
        email: `user${i}@example.com`,
        password: 'password123',
      });

      console.log(`User ${user.username} created.`);

      // Each user gets 2 CVs
      for (let j = 1; j <= 2; j++) {
        const cv = await cvService.create({
          name,
          firstname,
          age: 20 + i,
          cin: `${10000000 + i * 10 + j}`,
          job: randJobTitle(),
          path: `/uploads/cv_${i}_${j}.pdf`,
          userId: user.id,
        });

        // 3. Assign 2 to 4 random skills to this CV
        const shuffledSkills = [...skills].sort(
          () => Math.random() - 0.5,
        );

        const selectedSkills = shuffledSkills.slice(
          0,
          2 + Math.floor(Math.random() * 3),
        );

        const savedCv = await cvRepository.findOne({
          where: { id: cv.id },
          relations: { skills: true },
        });

        if (savedCv) {
          savedCv.skills = selectedSkills;
          await cvRepository.save(savedCv);
        }

        console.log(`CV ${cv.id} created with ${selectedSkills.length} skills.`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();