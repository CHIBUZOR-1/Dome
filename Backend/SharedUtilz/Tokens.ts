//Backend/SharedUtilz/Tokens.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import UserModel from "UserService/src/Model/userModel";
import { Types } from "mongoose";

// Extend Express Request to include user data
export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

/**
 * Sets a JWT in the user's cookies 
 */
const setCookiesWithToken = (userId: string | Types.ObjectId, res: Response): void => {
  const token = jwt.sign({ userId }, process.env.JWTSECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};


const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    try {
        const token = req.cookies?.jwt;
        if(!token) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized Access"
            })
        }
        const decode = jwt.verify(token, process.env.JWTSECRET as string) as JwtPayload;
        if(!decode) {
            return res.status(401).json({
                error: true,
                message: "Invalid Token"
            })
        }
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "An error occured!"
        })
    }
    

}

 

const isAdminz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
    try {
        const userId = (req.user as JwtPayload)?.userId;
        if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        }
        const user = await UserModel.findById(userId).select('-password');
        if(!user?.isAdmin) {
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        } else {
           next();
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "middleware error"
        })
    }
}

export { verifyToken, isAdminz, setCookiesWithToken };