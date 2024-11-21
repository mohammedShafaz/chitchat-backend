import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateUserRegistration, validateEmailVerification, validateParamsId } from "../middlewares/validatorMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import upload from "../utils/fileUpload";
class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    private routes(): void {
        this.router.post("/login", UserController.userLogin);
        this.router.get('/find',UserController.findUser);
        this.router.post("/register", upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'coverPicture', maxCount: 1 }]), validateUserRegistration, UserController.createUser);
        this.router.get("/", authMiddleware, UserController.getCurrentUser);
        this.router.get("/:id", validateParamsId, UserController.getUserById);
        this.router.post('/follow/:id', authMiddleware, validateParamsId, UserController.followUser);
        this.router.post('/unfollow/:id', authMiddleware, validateParamsId, UserController.unFollowUser);
        this.router.patch('/update', authMiddleware, UserController.updateUser);
        this.router.patch('/update/profile-picture', authMiddleware, upload.single('profilePicture'), UserController.updateProfilePicture);
        this.router.patch('/update/cover-picture', authMiddleware, upload.single('coverPicture'), UserController.updateCoverPicture);
        this.router.post("/verify-otp", validateEmailVerification, UserController.userVerification);
    }
}

export default new UserRoutes().router;