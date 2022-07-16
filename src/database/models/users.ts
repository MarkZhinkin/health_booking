import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { isEmail, isURL, isMobilePhone } from "validator";

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

    @Prop({ type: String, required: true, enum: ["notСonfirmed", "active", "blocked"], default: "notСonfirmed" })
    status: string;

    @Prop({ type: String, required: true, enum: ["user"], default: "user" })
    type: string;

    @Prop({ type: [Types.ObjectId], ref: "Appointments" })
    appointments: [Types.ObjectId];
}

export const UserSchema = SchemaFactory.createForClass(User);
