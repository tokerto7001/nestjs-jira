import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsString()
    name: string;
}