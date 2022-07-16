import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    Response,
    UploadedFile,
    UsePipes,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ShowUserInfoResponse } from "./responses";
import { Types } from "mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ImageValidationPipe } from "../commons/pipes/images-validation.pipe";
import { UpdateUserPhotoDto } from "./dto/update-user-photo.dto";
import { TypeValidationPipe } from "../commons/pipes/type-validation.pipe";
import * as path from "path";
import { createWriteStream } from "fs";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Get("/user")
    @ApiOkResponse({ status: 200, description: "Get user info.", type: ShowUserInfoResponse })
    async getUserInfo(@Request() request: { userId: Types.ObjectId }): Promise<ShowUserInfoResponse> {
        return await this.usersService.getUserById(request.userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Post("/user")
    @ApiOkResponse({ status: 302, description: "Update user info." })
    async updateUserInfo(
        @Request() request: { userId: Types.ObjectId },
        @Body() dto: UpdateUserDto,
        @Response() response
    ) {
        await this.usersService.updateUserInfoById(request.userId, dto);
        return response.redirect("/users/user");
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("JWT")
    @Post("/user/updatePhoto")
    @UsePipes(ImageValidationPipe)
    @UseInterceptors(FileInterceptor("file"))
    @ApiBody({
        description:
            "A new avatar for the user. " +
            "Photo must be in the format .jpg, .jpeg or .png. " +
            "Photo size no more then 3 Mb. ",
        type: UpdateUserPhotoDto,
    })
    @ApiOkResponse({ status: 302, description: "Update user photo." })
    async uploadedFile(
        @Request() request: { userId: Types.ObjectId }, 
        @UploadedFile() file, 
        @Response() response)
    {
        const ws = await createWriteStream(path.join("storage", file.originalname));
        await ws.write(file.buffer);

        await this.usersService.updateUserPhotoById(request.userId, file.originalname);

        return response.redirect("/users/user");
    }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth("JWT")
    // @UsePipes(TypeValidationPipe)
    // @Get("/user/appointments")
    // @ApiOkResponse({ status: 200, description: "Get user appointments.", type: ShowUserInfoResponse })
    // async getUserAppointments(@Request() request: { userId: Types.ObjectId }): Promise<ShowUserInfoResponse> {
    //     // pagination by 10 records
    //     return await this.usersService.getUserById(request.userId, 0);
    // }
}
