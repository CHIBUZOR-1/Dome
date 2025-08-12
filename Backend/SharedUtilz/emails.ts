import {
  VERIFICATION_EMAIL_TEMPLATE,
  VERIFIED_ACCOUNT_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates';

import { sender, transporter } from './nodemailer.config';

const sendVerificationEmail = async (email: string, verificationToken: string, name: string) => {
	try {
		const info = await transporter.sendMail({
            from: `"Trix" <${sender}>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("{username}", name.split(" ")[0]),
        });

		console.log('Email sent: %s', info.messageId);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

const sendVerifiedEmail = async (email: string, name: string) => {
	try {
		const info = await transporter.sendMail({
            from: `"Trix" <${sender}>`,
            to: email,
            subject: "Email Verified",
            html: VERIFIED_ACCOUNT_TEMPLATE.replace("{username}", name.split(" ")[0]),
        });

		console.log('Email sent: %s', info.messageId);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

const sendPasswordResetEmail = async (email: string, name: string, url: string) => {
	try {
		const info = await transporter.sendMail({
            from: `"Trix" <${sender}>`,
            to: email,
            subject: "Password Reset Link",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url).replace("{username}", name.split(" ")[0]),
        });

		console.log('Email sent: %s', info.messageId);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
}

const sendResetSuccessEmail = async (email: string, name: string) => {
	try {
		const info = await transporter.sendMail({
            from: `"Trix" <${sender}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{username}", name.split(" ")[0]),
        });

		console.log('Email sent: %s', info.messageId);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
}

export { sendVerificationEmail, sendVerifiedEmail, sendPasswordResetEmail, sendResetSuccessEmail }