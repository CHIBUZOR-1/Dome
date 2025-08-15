//Backend/UserService/src/Controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { setCookiesWithToken } from "@shared/Tokens";
import { sendVerificationEmail, sendVerifiedEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '@shared/emails'
import UserModel from "../Model/userModel";
import crypto from 'crypto'
import { getChannel } from "@shared/rabbitmq";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ ok: false, msg: "All fields required" });
    }

    const existsEmail = await UserModel.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Email already in use",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        ok: false,
        msg: "Enter a valid Email Address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "Please enter a strong password",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();
    const channel = getChannel();
    channel.publish(
      "user_exchange",     // exchange name
      "user.created",      // routing key
      Buffer.from(JSON.stringify({ userId: newUser._id.toString() }))
    );
    console.log('pp')
    await sendVerificationEmail(newUser.email, verificationToken, newUser.name);

    res.status(201).json({
      ok: true,
      error: false,
      msg: "Registered successfully",
    });
  } catch (error) {
    console.error("SIGN-UP ERROR:", error);
    res.status(500).json({
      ok: false,
      error: true,
      msg: "An error occurred!",
    });
  }
};

const login = async(req: Request, res: Response)=> {
  try {
    const { email, password } = req.body;
    console.log('ll')
        if(!email || !password) {
            return res.status(400).json({ok: false, msg: "All fields required"})
        }
        const user = await UserModel.findOne({ email });
        if(!user) {
            return res.status(400).json({
                error: true,
                ok: false,
                msg: "User not found"
            })
        } 

        if (!user.verified) {
            return res.status(400).json({ ok: false, msg: 'Account Unverified' });
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword) {
            return res.status(400).json({
                error: true,
                ok: false,
                msg: "Invalid password"
            });
        }
        setCookiesWithToken(user._id, res);
        res.status(200).json({
            ok: true,
            msg: "Login successful",
            user: { ...user.toObject(), password: undefined }
        });
  } catch (error) {
    res.status(500).json({
        ok: false,
        error: true,
        msg: "An error occurred!"
    })
  }
}

const googleAuth = async()=> {}

const verifyEmail = async(req: Request, res: Response) => {
  try {
    const { verificationCode } = req.body;
    const user = await UserModel.findOne({
			verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ ok: false, msg: "Invalid or expired token" });
		}

		user.verified = true;
		user.verificationToken = '';
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendVerifiedEmail(user.email, user.name);

		res.status(200).json({
			ok: true,
			msg: "Email verified successfully"
		});
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Server error" });
  }
}

const forgotPassword = async(req: Request, res: Response)=> {
  try {
    const { email } = req.body;
		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(400).json({ ok: false, msg: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, user.name, `${process.env.ORIGIN}/reset-password/${resetToken}`);

		res.status(200).json({ ok: true, msg: "Password reset link sent to your email" });
  } catch (error) {
    
  }
}

const resetPassword = async(req: Request, res: Response)=> {
  try {
    const { token } = req.params;
		const { password } = req.body;

		const user = await UserModel.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ ok: false, msg: "Invalid or expired reset token" });
		}

		// update password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, `${salt}`);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email, user.name);

		res.status(200).json({ ok: true, msg: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ ok: false, msg: "error occured" });
  }
}

const logout = async(req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0});
    res.cookie("socket", "", { maxAge: 0});
    res.status(200).json({
        ok: true,
        msg: "Logged Out successfully"
    })
  } catch (error) {
    res.status(500).json({
        error: true,
        ok: false,
        msg: "An error occured!"
    })
  }
}


export { login, forgotPassword, register, resetPassword, verifyEmail, googleAuth, logout}
