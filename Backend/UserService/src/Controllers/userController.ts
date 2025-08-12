import { Request, Response } from "express";
import UserModel from "../Model/userModel";
import { AuthRequest } from "@shared/Tokens";
import { JwtPayload } from "jsonwebtoken";

const updateProfile = async(req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone } = req.body;
            if (!name || email || !phone) {
            return res.status(400).json({ ok: false, msg: "No empty field!" });
        }
        const userId = (req.user as JwtPayload)?.userId;
        if (!userId) {
            return res.status(400).json({ ok: false, msg: "Unauthorized!" });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { name, email, phone }, { new: true });
        return res.status(202).json({
            ok: true,
            msg: "Profile updated",
            newDetailz: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: "An error occurred!" });
    }
}

const updateUserRole = async(req: Request, res: Response) => {
    try {
        const { newRole } = req.body;
        if(!newRole) {
            return res.send({error: "role required"});
        }
        const roleUpdated = await UserModel.findByIdAndUpdate(req.params.id, {role: newRole}, {new: true});
        if(roleUpdated) {
            res.status(200).json({
                ok: true,
                msg: "Role update successful"
            })
        } else {
            res.status(400).json({
                ok: false,
                msg: "Unable to update"
            })
        }
    } catch (error) {
        res.json({
            ok:false,
            msg: "Error occured"
        })
    }
}

const deleteUser = async(req: Request, res: Response)=> {

}

const getAllUsers = async(req: Request, res: Response)=> {
    try {
        const startIndex = parseInt(req.query.startIndex as string) || 0;
        const limit = parseInt(req.query.limit as string) || 9;
        const users = await UserModel.find({}).select('-password').sort({UpdatedAt: -1}).skip(startIndex).limit(limit);
        const totalUsers = await UserModel.countDocuments({});
        const now = new Date();
        const oneMonthAgo= new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await UserModel.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            ok: true,
            msg: "Retrieved Users Successfully",
            data: users,
            totalUsers,
            lastMonthUsers
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: "Error retrieving Users list"
        })
    }
}

export { updateProfile, updateUserRole, deleteUser, getAllUsers}