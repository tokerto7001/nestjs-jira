import { IsString, MinLength, MaxLength } from "class-validator";

export class UpdateWorkspaceDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    name: string;
}