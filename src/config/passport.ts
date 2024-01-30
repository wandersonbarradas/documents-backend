import passport from "passport";
import "dotenv/config";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { RequestHandler } from "express";
import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { getUserFromId } from "../services/users";
const notAuthoridedJson = { status: 401, message: "Não autorizado!" };
const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string,
};

passport.use(
    new JWTStrategy(option, async (payload, done) => {
        try {
            const user = getUserFromId(payload.id);
            if (user) {
                done(null, user);
            } else {
                done(notAuthoridedJson, false);
            }
        } catch (error) {
            console.log("🚀 ~ passport.use ~ error:", error);
        }
    }),
);

export const privateRouter: RequestHandler = async (req, res, next) => {
    passport.authenticate("jwt", (err: any, user: User) => {
        req.user = user;
        req.user ? next() : next(notAuthoridedJson);
    })(req, res, next);
};

export const generateToken = (data: { id: number; email: string }) => {
    return JWT.sign(data, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "1d",
    });
};

export default passport;
