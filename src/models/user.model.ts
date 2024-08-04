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
    posts: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    following: Schema.Types.ObjectId[];
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
        unique: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
        default:'http://localhost:5000/assets/default_profile_picture.jpg'
    },
    profileBio: {
        type: String,
        default:''
    },
    posts: [
        { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    followers: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    following: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ]
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;