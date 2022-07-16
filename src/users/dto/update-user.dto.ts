import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: "John", description: "User name." })
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ example: "+380631234567", description: "Phone number." })
    @IsOptional()
    readonly phone?: string;
}