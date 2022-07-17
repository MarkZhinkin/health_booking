import { Controller, Post, Body, UseGuards, Request, UsePipes } from "@nestjs/common";
import { AppointmentsService } from "./appointment.service";
import {  ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, RightsGuard } from "../auth";
import { Types } from "mongoose";
import { TypeValidationPipe } from "../commons/pipes/type-validation.pipe";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UsersTypeEnum } from "../commons/enums";
import { CreateAppointmentResponse } from "./responses/create-appointment.response";

@ApiTags("Appointments")
@Controller("appointments")
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @UseGuards(JwtAuthGuard, new RightsGuard([UsersTypeEnum.user]))
    @ApiBearerAuth("JWT")
    @UsePipes(TypeValidationPipe)
    @Post("/createAppointment")
    async createAppointment(
        @Request() request: { userId: Types.ObjectId },
        @Body() dto: CreateAppointmentDto
    ): Promise<CreateAppointmentResponse> {
        const isCreatedAppointment = await this.appointmentsService.createAppointment(request.userId, dto.doctorId);
        return { isCreatedAppointment: isCreatedAppointment };
    }

}
