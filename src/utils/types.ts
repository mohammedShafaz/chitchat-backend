import { Request } from "express";
import { Document, Schema } from "mongoose";
import { FriendRequestStatus } from "./enums";
export interface CustomRequest extends Request {

    user?: any
}
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    profilePicture: string;
    profileBio: string;
    coverPicture: string;
    posts: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    following: Schema.Types.ObjectId[];
    friendRequest: Schema.Types.ObjectId[]
}

export interface IPost extends Document {
    author: Schema.Types.ObjectId;
    content: string;
    media: string[];
    likes: Schema.Types.ObjectId[];
    comments: Schema.Types.ObjectId[];
}

export interface IFriendRequest extends Document {
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    status: FriendRequestStatus
}

export interface ImageUrl {
    profilePictureUrl: string | undefined;
    coverPictureUrl: string | undefined;
}