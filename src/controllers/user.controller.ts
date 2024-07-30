import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt'
import { hashSalt, EMAIL_PURPOSE } from "../utils/constants";
import otpService from '../utils/otpService'
import emailService from "../utils/emailService";
import jwt from "jsonwebtoken";
import config from "../config/config";
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
            if (user.isEmailVerified === false) {
                res.status(401).json({ message: "Please verify your email" });
                return;
            }
            const tokenPayload = { firstName: user.firstName, lastName: user.lastName, userId: user._id, email: user.email };
            const token = jwt.sign(tokenPayload, config.jwt_secret, { expiresIn: '24h' })
            res.status(200).json({
                status: true,
                message: "login successful",
                token,
                user
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User fetching failed" })
        }

    }


    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, username, email, password } = req.body;
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
                password: hashedPassword
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


    public async userVerification(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;

            const isVerified = await otpService.verifyOtp(email, otp);
            if (isVerified) {
                const user = await User.findOneAndUpdate({email:email}, { isEmailVerified: true });
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