import config from "../config/config";
import Post from "../models/post.model";
import { CustomRequest } from "../utils/types";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Comment from "../models/comment.model";


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
            const post = await Post.findById(postId).populate({ path: 'comments', options: { sort: { 'createdAt': -1 } } });
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
    public async likePost(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const postId = req.params.id;
            const user = await User.findById(userId);
            const post = await Post.findById(postId);
            if (!user || !post) {
                res.status(404).json({ message: "User or post not found" });
                return;
            }
            if (post.likes.includes(userId)) {
                res.status(400).json({ message: "user already liked this post" });
                return;
            }
            const like = await Post.findByIdAndUpdate(postId,
                { '$push': { likes: userId } },
                { new: true }
            )

            res.status(200).json({ message: 'Post liked successfully' });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to like a post" });
        }
    }

    public async unlikePost(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const postId = req.params.id;
            const user = await User.findById(userId);
            const post = await Post.findById(postId);
            if (!user || !post) {
                res.status(404).json({ message: "User or post not found" });
                return;
            }
            if (!post.likes.includes(userId)) {
                res.status(400).json({ message: "user not  liked this post" });
                return;
            }
            const unlike = await Post.findByIdAndUpdate(postId, {
                '$pull': { likes: userId }
            }, { new: true })

            res.status(200).json({ message: 'Post unlike successfully' });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to unlike a post" });
        }
    }
    public async removePost(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId= req.user?.id;
            const postId =req.params.id;            
            const user= await User.findById(userId);
            if(!user){
                res.status(401).json({message:'Please login'});
                return;
            }
            const post = await Post.findByIdAndDelete(postId);
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            await Comment.deleteMany({ post: postId })
            res.status(200).json({ message: 'Post deleted' });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete the post" });
        }
    }
}


export default new postController();
