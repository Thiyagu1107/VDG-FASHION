import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import userModel from "../Models/UserModel.js";
import otpModel from "../Models/OtpModel.js";
import { comparePassword, hashPassword } from "../Helpers/Auth.js";

dotenv.config();

const emailSender = process.env.EMAIL_SENDER;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: emailSender,
        pass: emailPassword,
    },
    authMethod: "PLAIN",
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const isOTPExpired = (createdAt) => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const expiryTime = 5 * 60 * 1000; 
    return timeDifference > expiryTime;
};


export const registerOTPController = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'Email already registered. Please login',
            });
        }
        const existingOTP = await otpModel.findOne({ email });
        
        if (existingOTP && !isOTPExpired(existingOTP.createdAt)) {
            const now = new Date();
            const timeDiff = existingOTP.expiry - now;
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            let timeRemainingMsg = '';
            if (minutes > 0) {
                timeRemainingMsg += `${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
            if (seconds > 0) {
                timeRemainingMsg += ` ${seconds} second${seconds > 1 ? 's' : ''}`;
            }

            return res.status(400).send({
                success: false,
                message: `An OTP has already been sent to this email. Please wait${timeRemainingMsg} before requesting a new OTP`,
            });
        }




        const otp = generateOTP();

        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); 

        await otpModel.findOneAndUpdate(
            { email },
            { email, otp, createdAt: new Date(), expiry: otpExpiry },
            { upsert: true }
        );

        await transporter.sendMail({
            from: `"VDG FASHION" <${emailSender}>`,
            to: email,
            subject: "Registration OTP",
            text: `Your OTP for registration is: ${otp} and valid for 5 minutes only`,
        });

        res.status(200).send({
            success: true,
            message: 'OTP sent to your email for registration',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role, otp } = req.body;
        if (!name) {
            return res.status(400).send({ message: 'Name is required' }); 
        }
        if (!email) {
            return res.status(400).send({ message: 'Email is required' }); 
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' }); 
        }

        const storedOTP = await otpModel.findOne({ email });
        if (!storedOTP || storedOTP.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (isOTPExpired(storedOTP.createdAt)) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, role }).save();

        await otpModel.deleteOne({ email });

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Email not registered' });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        });
    }
};

export const forgetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Email not registered' });
        }

        const existingOTP = await otpModel.findOne({ email });
        
        if (existingOTP && !isOTPExpired(existingOTP.createdAt)) {
            const now = new Date();
            const timeDiff = existingOTP.expiry - now;
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            let timeRemainingMsg = '';
            if (minutes > 0) {
                timeRemainingMsg += `${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
            if (seconds > 0) {
                timeRemainingMsg += ` ${seconds} second${seconds > 1 ? 's' : ''}`;
            }

            return res.status(400).send({
                success: false,
                message: `An OTP has already been sent to this email. Please wait${timeRemainingMsg} before requesting a new OTP`,
            });
        }



        const otp = generateOTP();

        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); 

        await otpModel.findOneAndUpdate(
            { email },
            { email, otp, createdAt: new Date(), expiry: otpExpiry },
            { upsert: true }
        );

        await transporter.sendMail({
            from: `"VDG FASHION" <${emailSender}>`,
            to: email,
            subject: "Reset Password OTP",
            text: `Your OTP to reset password is: ${otp} and valid for 5 minutes only`,
        });

        res.status(200).send({
            success: true,
            message: 'OTP sent to your email for password reset',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to send OTP',
            error,
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
   
        const storedOTP = await otpModel.findOne({ email });
        if (!storedOTP || storedOTP.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (isOTPExpired(storedOTP.createdAt)) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await hashPassword(newPassword);
        await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

        await otpModel.deleteOne({ email });

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone} = req.body;
        const user = await userModel.findById(req.user._id);

        let hashedPassword;
        if (password && password.length >= 4) {
            hashedPassword = await hashPassword(password);
        }

        const UpdatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
                instituteid: instituteid || user.instituteid,
                groupname: groupname || user.groupname,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            UpdatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Update Error',
            error,
       

        });
    }
};

export const getProfileController = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile information retrieved successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};

export const getAllProfilesController = async (req, res) => {
    try {
        
        const users = await userModel.find();
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({
            success: true,
            message: "User profiles retrieved successfully",
            count: users.length,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteProfileController = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
            deletedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteProfileByIdController = async (req, res) => {
    try {
        const userId = req.params.userId;

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
            deletedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};