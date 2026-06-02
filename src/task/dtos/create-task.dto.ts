import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number;
}