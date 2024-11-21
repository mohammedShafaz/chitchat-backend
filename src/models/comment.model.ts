import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
    comment: string;
    author: Schema.Types.ObjectId;
    post: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, { timestamps: true });

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;