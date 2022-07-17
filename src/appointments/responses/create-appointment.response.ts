import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentResponse {
    @ApiProperty({ example: true, description: "Is created appointment." })
    isCreatedAppointment: boolean;
}
