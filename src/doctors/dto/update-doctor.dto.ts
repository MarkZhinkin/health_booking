import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateDoctorDto {
    @ApiProperty({ example: "David", description: "Doctor name." })
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ example: "+380500348699", description: "Phone number." })
    @IsOptional()
    readonly phone?: string;
}