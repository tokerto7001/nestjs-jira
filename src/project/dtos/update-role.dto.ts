import { WorkSpaceRole } from "@prisma/client";
import { IsEnum, IsNumber, IsString, Min } from "class-validator";

export class UpdateRoleDto {
  @IsNumber()
  @Min(1)
  userId: number;
  
  @IsString()
  @IsEnum([WorkSpaceRole.ADMIN, WorkSpaceRole.MEMBER])
  role: WorkSpaceRole;
}