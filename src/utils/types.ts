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

export interface IMessage extends Document{
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    content:string;
    type:string;
    mediaUrl:string;
    status:string;
    readBy:Schema.Types.ObjectId[];
    timestamp:Date;
    deleted:boolean;
    conversationId:Schema.Types.ObjectId;
}

export interface IConversation extends Document{
    participants:Schema.Types.ObjectId[];
    isGroup:boolean;
    groupName:string;
    lastMessage:Schema.Types.ObjectId;
}
export interface IMessageData{
    senderId:string;
    receiverId:string;
    message:string;
}
export interface IMediaData{
    senderId:string;
    receiverId:string;
    mediaUrl:string;
}
