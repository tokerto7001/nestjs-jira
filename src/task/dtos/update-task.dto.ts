import { Status } from "@prisma/client"
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number;
}