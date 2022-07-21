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
    Param
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DoctorsService } from "./doctors.service";
import { ApiConsumes, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, RightsGuard } from "../auth";
import { Types } from "mongoose";
import { ImageValidationPipe } from "../commons/pipes/images-validation.pipe";
import { UpdateDoctorDto, UpdateDoctorPhotoDto } from "./dto";
import { TypeValidationPipe } from "../commons/pipes/type-validation.pipe";
import { UsersTypeEnum } from "../commons/enums";
import { diskStorage } from "multer";
import changeUploadFileName from "../commons/utils/change-upload-file-name";
import { ShowDoctorInfoResponse } from "./responses";

@ApiTags("Doctors")
@Controller("doctors")
export class DoctorsController {
    constructor(private doctorsService: DoctorsService) {}
    
    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor, UsersTypeEnum.user]))
    @ApiBearerAuth("JWT")
    @Get(":page?")
    @ApiOkResponse({ status: 200, description: "Show all doctors." })
    async showDoctors(@Param("page") page: number) {
        return await this.doctorsService.getDoctors(page);
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Get("/doctor")
    @ApiOkResponse({ status: 200, description: "Get doctor info." })
    async getDoctorInfo(@Request() request: { userId: Types.ObjectId }): Promise<ShowDoctorInfoResponse> {
        return await this.doctorsService.getDoctorById(request.userId);
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Post("/doctor")
    @ApiOkResponse({ status: 200, description: "Update dotor info." })
    async updateDoctorInfo(
        @Request() request: { userId: Types.ObjectId },
        @Body() dto: UpdateDoctorDto
    ): Promise<ShowDoctorInfoResponse> {
        return await this.doctorsService.updateDoctorInfoById(request.userId, dto);
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @Post("/doctor/updatePhoto")
    @UsePipes(ImageValidationPipe)
    @ApiConsumes("multipart/form-data")
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
    @ApiBody({ type: UpdateDoctorPhotoDto })
    @ApiOkResponse({ status: 200, description: "Update doctor photo." })
    async uploadedFile(@Request() request: { userId: Types.ObjectId }, @UploadedFile() file) {
        await this.doctorsService.updateDoctorPhotoById(request.userId, file.filename);
    }
}
