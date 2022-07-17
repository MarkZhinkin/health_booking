import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentDto {
    @ApiProperty({ type: "string", description: "Doctor id.",example: "62d4072e008616de38fa23a3" })
    doctorId: string;
}
