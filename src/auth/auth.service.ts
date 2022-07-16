import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { isStrongPassword } from "validator";
import { UserLoginResponse } from "../auth/responses/user-login.response";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async registration(userDto: CreateUserDto): Promise<UserLoginResponse> {
        const user = await this.usersService.getUserByEmail(userDto.email);
        if (user) {
            throw new HttpException("User already exist.", HttpStatus.BAD_REQUEST);
        }
        if (!this.validatePassword) {
            throw new HttpException("Password is weak.", HttpStatus.FORBIDDEN);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 13);
        const creatingUser = await this.usersService.createUser({ 
            email: userDto.email, regToken: hashPassword 
        });
        return this.generateToken(creatingUser._id, creatingUser.type);
    }

    async login(userDto: CreateUserDto): Promise<UserLoginResponse> {
        const user = await this.usersService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.regToken);
        if (user && passwordEquals) {
            return this.generateToken(user._id, user.type)
        } else {
            throw new UnauthorizedException({message: "No such user/password pair exists."})
        }
    }

    private async generateToken(_id: Types.ObjectId, _type: string): Promise<UserLoginResponse> {
        return { token: this.jwtService.sign({ id: _id , type: _type}), type: "bearer" };
    } 

    private validatePassword(password: string): boolean {
        return isStrongPassword(password);
    }

}
