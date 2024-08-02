import path from "path";
import config from "../config/config";
import Post from "../models/post.model";
import { BASE_PATH } from "../utils/constants";
import { CustomRequest } from "../utils/types";
import { Response } from "express";
import mongoose from "mongoose";


class postController {

    public async createPost(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { content } = req.body;
            const author = req.user?.id;
            const media = req.files ? (req.files as Express.Multer.File[]).map(file => {
                const fileType = file.mimetype.startsWith('image/') ? 'images' : '/videos';
                const baseUrl = `http://localhost:${config.port}`

                return  `${baseUrl}/assets/uploads/${fileType}/${file.filename}`;
            }) : [];
            const newPost = new Post({
                author:  new mongoose.Types.ObjectId(`${author}`),
                content: content,
                likes: [],
                comments: [],
                media: media

            });
            await newPost.save();
            res.status(201).json({ message: 'Post created successfully', post: newPost });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create post" });

        }
    }
}

export default new postController();
