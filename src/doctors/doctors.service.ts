import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Doctor, DoctorDocument } from "../database/models/doctors";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class DoctorsService {
    constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

    async createDoctor(dto: { email: string; password: string; specialization: string }): Promise<boolean> {
        const doctor = await this.getDoctorByEmail(dto.email);
        if (doctor) {
            throw new HttpException("Doctor already exist.", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 13);
        await this.doctorModel.create({
            email: dto.email,
            regToken: hashPassword,
            specialization: dto.specialization,
        });
        return true;
    }

    async getDoctorByEmail(email: string): Promise<Doctor> {
        return await this.doctorModel.findOne({ where: { email }, include: { all: true } });
    }

    async getDoctorById(id: Types.ObjectId, isShowId: 0 | 1 = 0): Promise<Doctor> {
        return await this.doctorModel.findById(id).select({
            _id: isShowId,
            email: 1,
            name: 1,
            phone: 1,
            photoAvatar: 1,
            status: 1,
        });
    }

    async updateDoctorInfoById(id: Types.ObjectId, dto: { name?: string | undefined; phone?: string | undefined }) {
        let doctor = await this.doctorModel.findOneAndUpdate({ id: id }, { name: dto.name, phone: dto.phone });
        if (dto.name) {
            doctor.name = dto.name;
        }
        if (dto.phone) {
            doctor.phone = dto.phone;
        }

        if (doctor.phone && doctor.name && doctor.status === "notСonfirmed") {
            doctor = await this.doctorModel.findOneAndUpdate({ id: id }, { status: "active" });
        }
    }

    async updateDoctorPhotoById(id: Types.ObjectId, photo: string): Promise<Doctor> {
        return await this.doctorModel.findOneAndUpdate({ id: id }, { photoAvatar: photo });
    }
}
