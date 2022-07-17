import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, AppointmentSchema } from "../database/models/appointments";
import { Doctor, DoctorSchema } from "../database/models/doctors";
import { User, UserSchema } from "../database/models/users";
import { AuthModule } from "../auth/auth.module";
import { AppointmentsService } from "./appointment.service";
import { AppointmentsController } from "./appointment.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Doctor.name, schema: DoctorSchema },
            { name: Appointment.name, schema: AppointmentSchema },
        ]),
        forwardRef(() => AuthModule)
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentModule {}
