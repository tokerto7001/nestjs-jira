import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    name: string;
}