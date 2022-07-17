import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { createTodayDate } from "../../commons/utils/create-today-date";
import { AppointmentStatusEnum } from "../../commons/enums";

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Appointment {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, unique: false, index: true, required: true, ref: "User" })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, unique: false, index: true, required: true, ref: "Doctor" })
    doctorId: Types.ObjectId;

    @Prop({ type: Date, unique: false, index: true, required: true, default: createTodayDate()})
    date: Date;

    @Prop({ type: String, required: true, enum: Object.values(AppointmentStatusEnum), default: AppointmentStatusEnum.created })
    status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
