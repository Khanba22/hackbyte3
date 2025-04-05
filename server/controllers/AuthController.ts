import bcrypt from "bcryptjs";
import User from "../models/User";
import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken"
const NEXT_PUBLIC_JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;

export const signUpWithPassword = async (req: Request, res: Response , next:NextFunction) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, isPasswordSet: true });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const fetchUserData = async(req:Request,res:Response)=>{

    try {
        if(!req.headers){
            res.status(401).send("No Valid Headers");
        }
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Auth failed' });
            return;
        }
        const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET  as string);
        const { id, username } = decodedToken as jwt.JwtPayload;
        const user = await User.findById(id);
        res.status(200).json({
            user
        })
    } catch (error) {
        res.status(401).json({ message: 'Auth failed' });
    }
}

export const loginWithPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        };

        if (!user.password) {
            res.status(403).json({ message: "User signed up with Google, set a password" });
            return;
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        console.log("Signing With",process.env.NEXT_PUBLIC_JWT_SECRET)
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.NEXT_PUBLIC_JWT_SECRET as string, { expiresIn: "1d" });
        console.log(user)
        res.json({ token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
}

export const authWithGoogle = async (req: Request, res: Response) => {
    const googleUser = req.user as any;

    let user = await User.findOne({ googleId: googleUser.id });
    if (!user) {
      user = new User({
        username: googleUser.displayName,
        email: googleUser.emails[0].value,
        googleId: googleUser.id,
        isPasswordSet: false,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.redirect(`/dashboard?token=${token}`);
  }