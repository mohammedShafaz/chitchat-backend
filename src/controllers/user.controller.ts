import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt'
import { hashSalt, EMAIL_PURPOSE, baseUrl } from "../utils/constants";
import otpService from '../utils/otpService'
import emailService from "../utils/emailService";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { CustomRequest, ImageUrl } from "../utils/types";
import mongoose, { ObjectId } from "mongoose";
class UserController {

    public async userLogin(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                res.status(400).json({ message: "username or password missing" });
                return;
            }
            const user = await User.findOne({
                $or: [{ email: email },
                { username: email }
                ]
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                res.status(401).json({ message: "Incorrect password" });
                return;
            }
            if (!user.isEmailVerified) {
                res.status(401).json({ message: "Please verify your email" });
                return;
            }
            const tokenPayload = { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email };
            const token = jwt.sign(tokenPayload, config.jwt_secret, { expiresIn: '24h' })
            res.status(200).json({
                status: true,
                message: "login successful",
                token
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User login failed" })
        }

    }
    private uploadImage = (files: { [fieldname: string]: Express.Multer.File[] }): ImageUrl => {

        const profilePicturePath = files?.profilePicture ? files.profilePicture[0].path : undefined;
        const coverPicturePath = files?.coverPicture ? files?.coverPicture[0].path : undefined;
        const profilePictureUrl = profilePicturePath ? `${baseUrl}/images/${profilePicturePath.split('/').pop()}` : undefined;
        const coverPictureUrl = coverPicturePath ? `${baseUrl}/images/${coverPicturePath.split('/').pop()}` : undefined;

        return { profilePictureUrl, coverPictureUrl };

    }

    public async createUser(req: Request, res: Response): Promise<void> {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        try {
            const { firstName, lastName, username, email, password, profileBio } = req.body;

            const profilePicturePath = files?.profilePicture ? files.profilePicture[0].path : undefined;
            const coverPicturePath = files?.coverPicture ? files?.coverPicture[0].path : undefined;
            const profilePictureUrl = profilePicturePath ? `${baseUrl}/images/${profilePicturePath.split('/').pop()}` : undefined;
            const coverPictureUrl = coverPicturePath ? `${baseUrl}/images/${coverPicturePath.split('/').pop()}` : undefined;

            const existingEmail = await User.findOne({ email: email });
            if (existingEmail) {
                res.status(400).json({ message: "User with this email already existing" });
                return;
            }
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                res.status(400).json({ message: 'Username already exists' });
                return;
            }
            const hashedPassword = bcrypt.hashSync(password, hashSalt);
            const userData = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                profilePicture: profilePictureUrl,
                profileBio: profileBio ? profileBio : '',
                coverPicture: coverPictureUrl
            })
            await userData.save();
            const otp = otpService.generateOtp();
            await otpService.storeOtp(email, otp);
            await emailService.sentOtp(email, EMAIL_PURPOSE.registration, otp);
            res.status(201).json({ status: true, message: "Please verify your email, otp sent to the email address.", });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User registration failed" });
        }
    }

    public async updateUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const { firstName, lastName, profileBio } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            firstName ? user.firstName = firstName : user.firstName;
            lastName ? user.lastName = lastName : user.lastName;
            profileBio ? user.profileBio = profileBio : user.profileBio;
            await user.save();
            res.status(200).json({ message: "User updated successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update user" });
        }
    }
    public async updateProfilePicture(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (!req.file) {
                res.status(400).json({ message: "Please upload an image" });
                return;
            }

            const profilePicturePath = req.file ? req.file.path : undefined;
            const profilePictureUrl = profilePicturePath ? `${baseUrl}/profilePictures/${profilePicturePath.split('/').pop()}` : undefined;

            if (profilePictureUrl) {
                user.profilePicture = profilePictureUrl
            }
            await user.save();
            res.status(200).json({ message: "Profile picture updated successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update user profile picture" });
        }
    }
    public async updateCoverPicture(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const coverPicturePath =  req.file ? req.file.path : undefined;
            const coverPictureUrl = coverPicturePath ? `${baseUrl}/coverPictures/${coverPicturePath.split('/').pop()}` : undefined;
            if (coverPictureUrl) {
                user.coverPicture = coverPictureUrl;
            }
            await user.save();
            res.status(200).json({ message: "Cover picture updated successfully", user });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update user cover picture" });
        }
    }

    public async getCurrentUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Please login' });
                return;
            }
            const user = await User.findById(userId)
                .populate({ path: 'posts', options: { sort: { 'createdAt': -1 } } })
                .populate('followers')
                .populate('following')
            if (!user) {
                res.status(404).json({ message: 'User not found' })
                return;
            }
            res.status(200).json({ status: true, message: 'User details fetched successfully', user });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User fetching failed" });

        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = new mongoose.Types.ObjectId(req.params.id);
            if (!userId) {
                res.status(401).json({ message: 'Please login' });
                return;
            }

            const user = await User.findById(userId)
                .populate({ path: 'posts', options: { sort: { 'createdAt': -1 } } })
                .populate('followers')
                .populate('following')
            if (!user) {
                res.status(404).json({ message: 'User not found' })
                return;
            }
            res.status(200).json({ status: true, message: 'User details fetched successfully', user });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User fetching failed" });

        }
    }

    public async followUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const followUserId = req.params.id as unknown as ObjectId;
            const user = await User.findById(userId);
            const followUser = await User.findById(followUserId);
            if (!user || !followUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (user.following.includes(followUserId)) {
                res.status(400).json({ message: 'You are already following this person' });
                return;
            }
            await User.findByIdAndUpdate(userId,
                { '$push': { following: followUserId } }
            );
            await User.findByIdAndUpdate(followUserId,
                { '$push': { followers: userId } }
            );
            res.status(200).json({ message: 'You are started following.' });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to follow user" });

        }
    }

    public async unFollowUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const unFollowUserId = req.params.id as unknown as ObjectId;
            const user = await User.findById(userId);
            const unFollowUser = await User.findById(unFollowUserId);
            if (!user || !unFollowUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (!user.following.includes(unFollowUserId)) {
                res.status(400).json({ message: 'You are not following this person' });
                return;
            }
            await User.findByIdAndUpdate(userId,
                { '$pull': { following: unFollowUserId } }
            );
            await User.findByIdAndUpdate(unFollowUserId,
                { '$pull': { followers: userId } }
            );
            res.status(200).json({ message: 'You unFollowed this person' });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to unFollow user" });
        }
    }

    public async userVerification(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            const isVerified = await otpService.verifyOtp(email, otp);
            if (isVerified) {
                const user = await User.findOneAndUpdate({ email: email }, { isEmailVerified: true });
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                    return;
                }
                res.status(200).json({ message: "User  successfully verified.", userId: user._id })
                return;
            }
            else {
                res.status(400).json({ message: 'Invalid or expired otp.' });
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User verification failed" })
        }
    }
}
export default new UserController();