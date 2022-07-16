import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    @IsEmail()
    readonly email: string;

    @IsString()
    @ApiProperty({ example: "Zxoubv!jf112", description: "Password" })
    readonly password: string;
}
