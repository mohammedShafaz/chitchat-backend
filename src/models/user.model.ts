import { Schema, Document, model } from "mongoose";
import { IUser } from "../utils/types";


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
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
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
        default: 'http://localhost:5000/assets/default_profile_picture.jpg'
    },
    profileBio: {
        type: String,
        default: ''
    },
    coverPicture: {
        type: String,
        default: 'http://localhost:5000/assets/Sample_Cover_photo.png'
    },
    posts: [
        { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    followers: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    following: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    friendRequest: [
        { type: Schema.Types.ObjectId, ref: 'FriendRequest' }
    ]
}, { timestamps: true });


const User = model<IUser>('User', userSchema);

export default User;