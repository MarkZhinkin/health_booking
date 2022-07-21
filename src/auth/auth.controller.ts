import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserLoginResponse } from "./responses/user-login.response";
import { BadRequestResponse } from "../commons/base-responses/bad-request.response";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @ApiOperation({summary: "User login."})
    @ApiOkResponse({ status: 200 , description: "User has been successfully login.", type: UserLoginResponse })
    async login(@Body() userDto: LoginUserDto): Promise<UserLoginResponse> {
        return await this.authService.login(userDto);
    }

    @Post("/registration")
    @ApiOperation({summary: "User registration."})
    @ApiOkResponse({ status: 201, description: "User has been successfully created.", type: UserLoginResponse })
    @ApiBadRequestResponse({ type: BadRequestResponse })
    async registration(@Body() userDto: CreateUserDto): Promise<UserLoginResponse>{
        return await this.authService.registration(userDto);
    }
}
