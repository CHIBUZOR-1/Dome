import { Request, Response } from "express";
import cartModel from "./cartModel";
import { AuthRequest } from "@shared/Tokens";
import { JwtPayload } from "jsonwebtoken";

const addToCart = async(req: AuthRequest, res: Response) => {
    try {
        const { itemId } = req.body
        const uId = (req.user as JwtPayload)?.userId;
        if (!uId) {
            return res.status(401).json({ ok: false, msg: "Unauthorized" });
        }
        if (!itemId || typeof itemId !== "string") {
            return res.status(400).json({ ok: false, msg: "Invalid item ID" });
        }
        await cartModel.updateOne(
            { userId: uId },
            { $inc: { [`items.${itemId}`]: 1 } },
            { upsert: true } // creates cart if it doesn't exist
        );
        return res.json({
            ok: true,
            msg: "Added to cart"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error"
        })
    }
}

const removeFromCart = async(req: AuthRequest, res: Response)=> {
    try {
        const { itemId } = req.body;
        const uId = (req.user as JwtPayload)?.userId;
        if (!uId) {
            return res.status(401).json({ ok: false, msg: "Unauthorized" });
        }
        if (!itemId || typeof itemId !== "string") {
            return res.status(400).json({ ok: false, msg: "Invalid item ID" });
        }
        const cart = await cartModel.findOneAndUpdate(
            { userId: uId, [`items.${itemId}`]: { $gt: 0 } },
            { $inc: { [`items.${itemId}`]: -1 } },
            { new: true}
        );
        if (cart?.items?.[itemId] === 0) {
            await cartModel.updateOne({ userId: uId }, { $unset: { [`items.${itemId}`]: "" } });
        }
        return res.status(200).json({
            ok: true,
            msg: "Removed from cart"
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error"
        })
    }
}

const getCartItems = async(req: AuthRequest, res: Response)=> {
    try {
        const uId = (req.user as JwtPayload)?.userId;
        if (!uId) {
            return res.status(401).json({ ok: false, msg: "Unauthorized" });
        }
        const cart = await cartModel.findOne({ userId: uId}).lean();
        return res.status(200).json({
            ok: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            okay: false,
            msg: 'Cart Error!'
        })
    }
}

export { addToCart, removeFromCart, getCartItems };