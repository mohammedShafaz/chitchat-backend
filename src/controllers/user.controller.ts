import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt'
import { hashSalt } from "../utils/constants";
class UserController {

    public getUser(req: Request, res: Response): void {
        res.send("User fetched");
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
            res.status(201).json({ status: true, message: "USer created successfully", });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "User registration failed" })
        }
    }
}
export default new UserController();