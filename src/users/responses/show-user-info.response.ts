import { ApiProperty } from "@nestjs/swagger";

export class ShowUserInfoResponse {
    @ApiProperty({ example: "example@gmail.com", description: "Email." })
    email: string;

    @ApiProperty({ example: "John", description: "User name." })
    name?: string;

    @ApiProperty({ example: "+380631234567", description: "Phone number." })
    phone?: string;

    @ApiProperty({ example: "http://127.0.0.1/user_image", description: "Link to user image." })
    photoAvatar?: string;

    @ApiProperty({ example: "active", description: "User's status." })
    status: string;
}
