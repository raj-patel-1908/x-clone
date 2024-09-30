import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import setCookies from "../utils/setCookies.js";

export const signupController = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required!"
            });
        };

        if (username.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Username should be minimum length of 5!"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password should be minimum length of 6!"
            })
        }

        const isExistsUsername = await User.findOne({ username });

        if (isExistsUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already Taken!"
            });
        }

        const isExistsEmail = await User.findOne({ email });

        if (isExistsEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already Registered with different Account!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        setCookies(user._id, res);
        await user.save();

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                coverImage: user.coverImage,
                bio: user.bio,
                followers: user.followers,
                followings: user.followings
            }
        });

    } catch (error) {

        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Username or Email already exists!"
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required!"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password!"
            });
        }

        setCookies(user._id, res);
        res.status(200).json({
            success: true,
            message: "Login Successful!",
            data: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                coverImage: user.coverImage,
                bio: user.bio,
                followers: user.followers,
                followings: user.followings
            }
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        res
            .clearCookie("token")
            .status(200)
            .json({
                success: true,
                message: "Logout Successful!"
            })
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}