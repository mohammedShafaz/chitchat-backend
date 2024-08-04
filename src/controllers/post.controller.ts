import path from "path";
import config from "../config/config";
import Post from "../models/post.model";
import { BASE_PATH } from "../utils/constants";
import { CustomRequest } from "../utils/types";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";


class postController {

    public async createPost(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { content } = req.body;
            const author = req.user?.id;
            const media = req.files ? (req.files as Express.Multer.File[]).map(file => {
                const fileType = file.mimetype.startsWith('image/') ? 'images' : '/videos';
                const baseUrl = `http://localhost:${config.port}`

                return `${baseUrl}/assets/uploads/${fileType}/${file.filename}`;
            }) : [];
            const newPost = new Post({
                author: new mongoose.Types.ObjectId(`${author}`),
                content: content,
                likes: [],
                comments: [],
                media: media

            });
            const savedPost = await newPost.save();

            await User.findByIdAndUpdate(
                author,
                { $push: { posts: savedPost._id } },
                { new: true }
            );
            res.status(201).json({ message: 'Post created successfully', post: savedPost });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create post" });

        }
    }

    public async getPost(req: Request, res: Response): Promise<void> {
        try {
            const postId = new mongoose.Types.ObjectId(req.params.id);
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ message: "Post not found" });
                return;
            }
            res.status(200).json({
                status: true,
                message: 'Post fetched successfully',
                post
            })
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch post" });
        }
    }
}

export default new postController();
