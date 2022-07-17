import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { isEmail, isURL, isMobilePhone } from "validator";
import { UsersTypeEnum, UsersStatusEnum } from "../../commons/enums";

export type UserDocument = User & Document;

@Schema()
export class User {
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

    @Prop({ type: String, required: true, enum: Object.values(UsersTypeEnum), default: UsersTypeEnum.user })
    type: string;

    @Prop({ type: [Types.ObjectId], ref: "Appointment" })
    appointments: [Types.ObjectId];
}

export const UserSchema = SchemaFactory.createForClass(User);
