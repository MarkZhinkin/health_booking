import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
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
import { UsersTypeEnum } from "../commons/enums";
import { diskStorage } from "multer";
import changeUploadFileName from "../commons/utils/change-upload-file-name";

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
    @ApiOkResponse({ status: 200, description: "Update user info.", type: ShowUserInfoResponse })
    async updateUserInfo(
        @Request() request: { userId: Types.ObjectId },
        @Body() dto: UpdateUserDto
    ): Promise<ShowUserInfoResponse> {
        return await this.usersService.updateUserInfoById(request.userId, dto);
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.user]))
    @ApiBearerAuth("JWT")
    @Post("/user/updatePhoto")
    @UsePipes(ImageValidationPipe)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "storage",
                filename: changeUploadFileName,
            }),
        })
    )
    @ApiBody({ type: UpdateUserPhotoDto })
    @ApiOkResponse({ status: 200, description: "Update user photo." })
    async uploadedFile(@Request() request: { userId: Types.ObjectId }, @UploadedFile() file) {
        await this.usersService.updateUserPhotoById(request.userId, file.filename);
    }
}
