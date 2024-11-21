import { Response } from "express";
import Comment from "../models/comment.model";
import Post from "../models/post.model";
import { CustomRequest } from "../utils/types";
import User from "../models/user.model";
class CommentController {

    public async createComment(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const postId = req.params.id;
            const { comment } = req.body;
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ message: "Post not found" });
                return;
            }
            const commentData = new Comment({
                comment,
                author: userId,
                post: postId
            })
            const response = await commentData.save()
            await Post.findByIdAndUpdate(postId, {
                '$push': { comments: response.id }
            }, { new: true });
            res.status(201).json({ message: "Comment created successfully", response });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to comment on a post" });
        }
    }

    public async removeComment(req:CustomRequest,res:Response):Promise<void>{
        try {
            const userId= req.user?.id;
            const commentId= req.params.id;
            const user= await User.findById(userId);
            const comment= await Comment.findByIdAndDelete(commentId);
            if(!user){
                res.status(401).json({message:'Please login'});
                return;
            }
            if(!comment){
                res.status(404).json({message:'Comment not found'});
                return;
            }
            await Post.findByIdAndUpdate(comment.post,{
                '$pull':{comments:commentId}
            });
            res.status(200).json({message:"Comment deleted"});

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to remove comment" });
        }
    }

}

export default new CommentController()