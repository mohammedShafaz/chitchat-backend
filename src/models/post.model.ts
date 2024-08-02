import { Schema, Document, model } from "mongoose";

export interface IPost extends Document {
    author: Schema.Types.ObjectId;
    content: string;
    media: string[];
    likes: Schema.Types.ObjectId[];
    comments: Schema.Types.ObjectId[];
}

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
    comments: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Post= model<IPost>('Post',postSchema);

export default Post;