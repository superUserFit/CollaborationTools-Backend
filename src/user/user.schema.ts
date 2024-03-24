import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true
})

export class User {
    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    username: string

    @Prop({ unique: [true, 'User with this email already exist']})
    email: string

    @Prop()
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);