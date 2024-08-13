import FriendRequest from "../models/friendRequest.model";
import User from "../models/user.model";
import { Response } from "express";
import { CustomRequest } from "../utils/types";
import mongoose, { ObjectId } from "mongoose";
import { FriendRequestStatus } from "../utils/enums";


class FriendsController {


    public async sendFriendRequest(req: CustomRequest, res: Response): Promise<void> {
        try {
            const senderId = req.user?.id;
            const receiverId = req.params.id as unknown as ObjectId;
            const sender = await User.findById(senderId);
            const receiver = await User.findById(receiverId);
            if (!sender || !receiver) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
            if (existingRequest) {
                res.status(400).json({ message: "Friend request already send" });
                return;
            }
            if (sender.following.includes(receiverId) && receiver.following.includes(senderId)) {
                res.status(400).json({ message: 'You are already friends' });
                return;
            }
            const friendRequest = new FriendRequest({
                sender: senderId,
                receiver: receiverId
            });
            await friendRequest.save();
            res.status(201).json({ message: 'Friend request sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to send friend request" })
        }
    }

    public async acceptFriendRequest(req: CustomRequest, res: Response): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userId = req.user?.id;
            const friendRequestId = req.params.id as unknown as ObjectId;

            const user = await User.findById(userId);

            if (!user) {
                await session.abortTransaction();
                session.endSession();
                res.status(403).json({ message: "Unauthorized, please login" });
                return;
            }
            const friendRequest = await FriendRequest.findById(friendRequestId);

            if (!friendRequest) {
                await session.abortTransaction();
                session.endSession();
                res.status(404).json({ message: 'No friend request found' });
                return;
            }
            if (friendRequest.receiver.toString() !== userId.toString()) {
                await session.abortTransaction();
                session.endSession();
                res.status(403).json({ message: 'unauthorized' });
                return;
            }
            friendRequest.status = FriendRequestStatus.ACCEPTED;
            await friendRequest.save();

            const senderUpdate = {
                $push: { following: friendRequest.receiver },
            };
            const receiverUpdate = {
                $push: { followers: friendRequest.sender },
            };

            await User.findByIdAndUpdate(friendRequest.sender, senderUpdate, { new: true });

            await User.findByIdAndUpdate(friendRequest.receiver, receiverUpdate, { new: true });

            await FriendRequest.findByIdAndDelete(friendRequestId);

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: "Friend request accepted" });
            return;

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to accept friend request" })
        }
    }

    public async declineFriendRequest(req: CustomRequest, res: Response): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userId = req.user?.id;
            const friendRequestId = (req.params.id) as unknown as ObjectId;

            const user = await User.findById(userId);
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                res.status(403).json({ message: "Unauthorized, please login" });
                return;
            }
            const friendRequest = await FriendRequest.findById(friendRequestId);
            if (!friendRequest) {
                await session.abortTransaction();
                session.endSession();
                res.status(404).json({ message: "No request found" });
                return;
            }
            if (friendRequest?.receiver.toString() !== userId.toString()) {
                await session.abortTransaction();
                session.endSession();
                res.status(403).json({ message: "Unauthorized" });
                return;
            }
            if (friendRequest.status !== FriendRequestStatus.PENDING) {
                await session.abortTransaction();
                session.endSession();
                res.status(400).json({ message: 'Friend request already accepted or rejected' });
                return;
            }

            await FriendRequest.findByIdAndDelete(friendRequestId);
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: 'Friend request declined successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to decline friend request" })
        }
    }

    public async getFriendRequests(req: CustomRequest, res: Response): Promise<void> {
        try {
            console.log("getFriendRequest triggered...");

            const userId = req.user?.id;
            const objectIdUserId = new mongoose.Types.ObjectId(userId);
            const query = [
                {
                  $match: {
                    receiver: objectIdUserId,
                  },
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'senderDetails',
                  },
                },
                {
                  $unwind: '$senderDetails',
                },
                {
                  $project: {
                    _id: 1,
                    senderId: '$sender',
                    senderUsername: '$senderDetails.username',
                    senderProfilePicture: '$senderDetails.profilePicture',
                    requestStatus:'$status'
                  },
                },
              ];

            const friendRequest = await FriendRequest.aggregate(query);
            if (!friendRequest) {
                res.status(404).json({ message: 'No friend request found' });
                return;
            }
            res.status(200).json({
                message: "Friend request fetched successfully",
                friendRequest
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch friend request list' })
        }
    }
}

export default new FriendsController()