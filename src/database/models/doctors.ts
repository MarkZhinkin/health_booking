import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { isEmail, isURL, isMobilePhone } from "validator";
import { UsersTypeEnum, UsersStatusEnum, DoctorSpecializationEnum } from "../../commons/enums";

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
    _id: Types.ObjectId;
 
    @Prop({ type: String, unique: true, index: true, required: true, validate: [isEmail, "Invalid email."] })
    email: string;

    @Prop({ type: String, required: true })
    regToken: string;

    @Prop({ type: String, validate: [isURL, "Photo avatar nums be uri."] })
    photoAvatar: string;

    @Prop({ type: String, validate: [isMobilePhone, "Invalid phone number."] })
    phone: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String, required: true, enum: Object.values(UsersStatusEnum), default: UsersStatusEnum.notСonfirmed })
    status: string;

    @Prop({ type: String, required: true, enum: Object.values(UsersTypeEnum), default: UsersTypeEnum.doctor })
    type: string;

    @Prop({ type: String, required: true, enum: Object.values(DoctorSpecializationEnum), default: DoctorSpecializationEnum.therapist })
    specialization: string;

    @Prop({ type: Boolean, required: true, default: true })
    isFree: boolean;

    @Prop({ type: [Types.ObjectId], ref: "Appointment" })
    appointments: [Types.ObjectId];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
