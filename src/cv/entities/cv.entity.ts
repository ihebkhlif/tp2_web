
import * as typeorm from 'typeorm';

import { User } from '../../user/entities/user.entity.js';
import { Skill } from '../../skill/entities/skill.entity.js';

@typeorm.Entity()
export class Cv {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.Column()
  name: string;

  @typeorm.Column()
  firstname: string;

  @typeorm.Column()
  age: number;

  @typeorm.Column()
  cin: string;

  @typeorm.Column()
  job: string;

  @typeorm.Column()
  path: string;

  @typeorm.ManyToOne(() => User, (user) => user.cvs)
  user: typeorm.Relation<User>;

  @typeorm.ManyToMany(() => Skill, (skill) => skill.cvs)
  @typeorm.JoinTable()
  skills: typeorm.Relation<Skill[]>;
}
