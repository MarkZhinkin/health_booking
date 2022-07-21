import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Appointment, AppointmentDocument } from "../database/models/appointments";
import { Doctor, DoctorDocument } from "../database/models/doctors";
import { User, UserDocument } from "../database/models/users";
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersStatusEnum } from "../commons/enums";
import { createTodayDate } from "../commons/utils/create-today-date";

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
        @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    // TODO Show all appointments by user id.
    // TODO Show all appointments by doctor id.
    // TODO If doctor dont accept - cancel it.
    
    async createAppointment(userId: Types.ObjectId, doctorId: string): Promise<boolean> {
        let doctor = await this.doctorModel.findOne({
            id: doctorId, 
            status: {$ne: UsersStatusEnum.blocked},
            include: { all: true },
            isFree: true
        }).populate("appointments");
        let user = await this.userModel.findOne({id: userId, status: { $ne: UsersStatusEnum.blocked }, include: { all: true } });
        if (!doctor || !user) {
            throw new HttpException("Appointment blocked.", HttpStatus.FORBIDDEN);
        } else {
            const appointment = await this.appointmentModel.create({ userId: userId, doctorId: doctorId });
            const appointmentByToday = doctor.appointments.filter((record) => {
                // @ts-ignore
                return record.date.toISOString().slice(0, 10) === createTodayDate().toISOString().slice(0, 10);
            })
            if (appointmentByToday.length >= 2) {
                doctor.isFree = false;
            }
            doctor.appointments.push(appointment._id);
            await doctor.save();
            
            return true;
        }
    }

}
