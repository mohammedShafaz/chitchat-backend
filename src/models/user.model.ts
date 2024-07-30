import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    profilePicture: string;
    profileBio: string;
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default:false
    },
    profilePicture: {
        type: String,
    },
    profileBio: {
        type: String,
    }
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;