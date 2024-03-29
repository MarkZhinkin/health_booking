import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { DoctorsModule } from "../doctors/doctors.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "PRIVATE_KEY",
            signOptions: {
                expiresIn: "24h",
            },
        }),
        forwardRef(() => UsersModule),
        forwardRef(() => DoctorsModule)
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
