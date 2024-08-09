import { Schema, Document, model } from "mongoose";
import { IPost } from "../utils/types";

const postSchema = new Schema<IPost>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String
    },
    media: [{ type: String, required: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const Post= model<IPost>('Post',postSchema);

export default Post;