import { Schema, model, Document } from "mongoose";
import { IFriendRequest } from "../utils/types";
import { FriendRequestStatus } from "../utils/enums";

const friendRequestSchema = new Schema<IFriendRequest>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(FriendRequestStatus),
        default: FriendRequestStatus.PENDING
    }
}, { timestamps: true });

const FriendRequest= model<IFriendRequest>('FriendRequest',friendRequestSchema);

export default FriendRequest;