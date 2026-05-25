import { IsNumber, Min } from "class-validator";

export class MemberOperationDto {
  @IsNumber()
  @Min(1)
  userId: number;
}