import type { RequestHandler } from "express";
import { getUserById } from "../modules/auth/auth.service.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies?.devjudge_token;

        if (!token) {
            res.status(401).json({
                message: "Unauthorized",
            });

            return;
        }

        const payload = verifyToken(token);
        const user = await getUserById(payload.userId);

        res.locals.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
};