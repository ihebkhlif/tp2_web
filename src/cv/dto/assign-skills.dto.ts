
import { IsArray, IsInt, ArrayUnique } from 'class-validator';

export class AssignSkillsDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  skillIds: number[];
}
