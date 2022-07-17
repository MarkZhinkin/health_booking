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
import { DoctorsService } from "./doctors.service";
import { ApiConsumes, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, RightsGuard } from "../auth";
import { Types } from "mongoose";
import { ImageValidationPipe } from "../commons/pipes/images-validation.pipe";
import { UpdateDoctorDto, UpdateDoctorPhotoDto } from "./dto";
import { TypeValidationPipe } from "../commons/pipes/type-validation.pipe";
import * as path from "path";
import { createWriteStream } from "fs";
import { UsersTypeEnum } from "../commons/enums";

@ApiTags("Doctors")
@Controller("doctors")
export class DoctorsController {
    constructor(private doctorsService: DoctorsService) {}

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Get("/doctor")
    @ApiOkResponse({ status: 200, description: "Get doctor info." })
    async getDoctorInfo(@Request() request: { userId: Types.ObjectId }) {
        return await this.doctorsService.getDoctorById(request.userId);
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Post("/doctor")
    @ApiOkResponse({ status: 302, description: "Update dotor info." })
    async updateDoctorInfo(
        @Request() request: { userId: Types.ObjectId },
        @Body() dto: UpdateDoctorDto,
        @Response() response
    ) {
        await this.doctorsService.updateDoctorInfoById(request.userId, dto);
        return response.redirect("/doctors/doctor");
    }

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.doctor]))
    @ApiBearerAuth("JWT")
    @Post("/doctor/updatePhoto")
    @UsePipes(ImageValidationPipe)
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @ApiBody({ type: UpdateDoctorPhotoDto })
    @ApiOkResponse({ status: 302, description: "Update doctor photo." })
    async uploadedFile(@Request() request: { userId: Types.ObjectId }, @UploadedFile() file, @Response() response) {
        const filename = `${request.userId}.${file.originalname.split(".").slice(-1).pop()}`;
        const ws = createWriteStream(path.join("storage", filename));
        ws.write(file.buffer);

        await this.doctorsService.updateDoctorPhotoById(request.userId, filename);

        return response.redirect("/doctors/doctor");
    }
}
