import { Schema, model, Document } from "mongoose";
import { IMessage } from "../utils/types";
import { MessageStatus, MessageType } from "../utils/enums";

const messageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: MessageType,
        default: MessageType.TEXT,
        required: true
    },
    mediaUrl: {
        type: String
    },
    status: {
        type: String,
        enum: MessageStatus,
        default: MessageStatus.SEND
    },
    readBy: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    timestamp: { type: Date, default: Date.now },
    deleted: {
        type: Boolean,
        default: false
    },
    conversationId: {
        type: Schema.Types.ObjectId, ref: 'Conversation',
        index:true
    }
}, { timestamps: true });


const Message = model<IMessage>('Message', messageSchema);
export default Message;

