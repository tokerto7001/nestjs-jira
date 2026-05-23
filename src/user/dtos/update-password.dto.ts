import { IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  password: string;
  
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}