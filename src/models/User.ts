import mongoose, { Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  }
});

export const User = mongoose.model<UserDocument>('User', UserSchema);