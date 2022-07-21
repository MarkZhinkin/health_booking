import { ApiProperty } from "@nestjs/swagger";

export class ShowDoctorInfoResponse {
    @ApiProperty({ example: "doctor@gmail.com", description: "Doctor's email." })
    email: string;

    @ApiProperty({ example: "David", description: "Doctor's name." })
    name?: string;

    @ApiProperty({ example: "+380631234567", description: "Phone number." })
    phone?: string;

    @ApiProperty({ example: "http://127.0.0.1/doctor_image", description: "Link to doctor image." })
    photoAvatar?: string;

    @ApiProperty({ example: "active", description: "Doctor's status." })
    status: string;

    @ApiProperty({ example: "therapist", description: "Doctor's specialization." })
    specialization: string;

    @ApiProperty({ example: "true", description: "If doctor is free you can create appointment with him." })
    isFree: boolean;
}
