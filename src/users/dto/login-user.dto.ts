import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { UsersTypeEnum } from "../../commons/enums";

export class LoginUserDto {
    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    @IsEmail()
    readonly email: string;

    @IsString()
    @ApiProperty({ example: "Zxoubv!jf112", description: "Password" })
    readonly password: string;

    @IsString()
    @ApiProperty({ example: UsersTypeEnum.user, examples: Object.values(UsersTypeEnum), description: "User type." })
    readonly type: string;
}
