import type { RequestHandler } from "express";
import type { UserRole, AuthenticatedUser } from "../types/auth.types.js";

export function requireRole(role: UserRole): RequestHandler {
    return (_req, res, next) => {
        const user = res.locals.user as AuthenticatedUser | undefined;

        if (!user) {
            res.status(401).json({
                message: "Unauthorized",
            });

            return;
        }

        if (user.role !== role) {
            res.status(403).json({
                message: "Forbidden",
            });

            return;
        }
        
        next();
    }
}