import { IsNumber, Min } from "class-validator";

export class RemoveFromProjectDto {
  @IsNumber()
  @Min(1)
  userId: number;
}