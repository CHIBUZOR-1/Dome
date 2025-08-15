// Backend/UserService/src/userRoutes.ts
import express from 'express';
const userRouter = express.Router();
import { verifyToken, isAdminz } from "@shared/Tokens";
import { forgotPassword, googleAuth, login, logout, register, resetPassword, verifyEmail } from './Controllers/authController';
import { deleteUser, getAllUsers, updateProfile, updateUserRole } from './Controllers/userController';


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.get('/logout', logout);
userRouter.post('/googleAuth', googleAuth);
userRouter.get('/all-users',  verifyToken, isAdminz, getAllUsers)
userRouter.put('/update-profile', verifyToken, updateProfile);
userRouter.put('/update_role/:id', verifyToken, isAdminz, updateUserRole);
userRouter.delete('/delete-user/:id', verifyToken, isAdminz, deleteUser);
userRouter.get('/user-pass', verifyToken, (req, res) => {
    res.status(200).send({
        ok: true
    });
});

userRouter.get('/admin-pass', verifyToken, isAdminz, (req, res) => {
    res.status(200).send({
        ok: true
    });
});

export default userRouter;