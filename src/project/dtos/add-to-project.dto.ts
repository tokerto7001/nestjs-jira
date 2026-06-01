import { IsInt } from "class-validator";

export class AddToProjectDto {
  @IsInt()
  userId: number;
}