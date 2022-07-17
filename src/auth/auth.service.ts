import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { isStrongPassword } from "validator";
import { UserLoginResponse } from "../auth/responses/user-login.response";
import { Types } from "mongoose";
import { UsersTypeEnum } from "../commons/enums";
import { User } from "../database/models/users";
import { Doctor } from "../database/models/doctors";
import { DoctorsService } from "../doctors/doctors.service"


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private DoctorsService: DoctorsService
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

    async login(dto: LoginUserDto): Promise<UserLoginResponse> {
        let user: User | Doctor;
        if (dto.type === UsersTypeEnum.user) {
            user = await this.usersService.getUserByEmail(dto.email);
        } else if(dto.type === UsersTypeEnum.doctor) {
            user = await this.DoctorsService.getDoctorByEmail(dto.email);
        } else {
            throw new HttpException(`Unexpected user type "${dto.type}"`, HttpStatus.FORBIDDEN);
        }
        
        if (!user) {
            throw new UnauthorizedException({message: "No such user/password pair exists."})
        }

        const passwordEquals = await bcrypt.compare(dto.password, user.regToken);
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
