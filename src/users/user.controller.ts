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
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { ApiConsumes, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, RightsGuard } from "../auth";
import { ShowUserInfoResponse } from "./responses";
import { Types } from "mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ImageValidationPipe } from "../commons/pipes/images-validation.pipe";
import { UpdateUserPhotoDto } from "./dto/update-user-photo.dto";
import { TypeValidationPipe } from "../commons/pipes/type-validation.pipe";
import * as path from "path";
import { createWriteStream } from "fs";
import { UsersTypeEnum } from "../commons/enums";

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

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.user]))
    @ApiBearerAuth("JWT")
    @Post("/user/updatePhoto")
    @UsePipes(ImageValidationPipe)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @ApiBody({ type: UpdateUserPhotoDto })
    @ApiOkResponse({ status: 302, description: "Update user photo." })
    async uploadedFile(@Request() request: { userId: Types.ObjectId }, @UploadedFile() file, @Response() response) {
        const filename = `${request.userId}.${file.originalname.split(".").slice(-1).pop()}`;
        const ws = createWriteStream(path.join("storage", filename));
        ws.write(file.buffer);

        await this.usersService.updateUserPhotoById(request.userId, filename);

        return response.redirect("/users/user");
    }
}
