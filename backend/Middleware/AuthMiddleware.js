    import jwt from "jsonwebtoken";
    import userModel from "../Models/UserModel.js";

    export const requireSignIn = async (req, res, next) => {
        // const authHeader = req.headers.authorization;

        // if (!authHeader) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authorization header missing or invalid',
        //     });
        // }

        // const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
    };


    export const isAdmin = async (req, res, next) => {
        try {
            const user = await userModel.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            if (user.role !== 1) { 
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized Access',
                });
            }

            next();
        } catch (error) {
            console.error('Error in admin middleware:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while checking admin access',
                error: error.message,
            });
        }
    };
