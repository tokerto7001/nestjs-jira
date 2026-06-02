import { IsInt, IsOptional, Max, Min } from "class-validator";

export class GetTasksDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  offset?: number;
}