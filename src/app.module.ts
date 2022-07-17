import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import createConnectionString from "./commons/utils/create-connection-string";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { CreateDoctorCommand } from "./commands/create-doctor.command";
import { AppointmentModule } from "./appointments/appointment.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        MongooseModule.forRoot(createConnectionString()),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        DoctorsModule,
        AppointmentModule,
    ],
    controllers: [],
    providers: [CreateDoctorCommand],
})
export class AppModule {}
