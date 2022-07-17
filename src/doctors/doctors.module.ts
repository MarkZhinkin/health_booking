import { forwardRef, Module } from "@nestjs/common";
import { DoctorsService } from "./doctors.service";
import { DoctorsController } from "./doctors.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Doctor, DoctorSchema } from "../database/models/doctors";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
        forwardRef(() => AuthModule)
    ],
    controllers: [DoctorsController],
    providers: [DoctorsService],
    exports: [DoctorsService],
})
export class DoctorsModule {}
