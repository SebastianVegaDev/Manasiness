import jwt from "jsonwebtoken";

export type TokenPayload = {
    userId: string
    role: string
}

export function createToken(payload: TokenPayload) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): TokenPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }

    if (typeof decoded.userId !== "string" || typeof decoded.role !== "string") {
        throw new Error("Invalid token payload");
    }

    return {
        userId: decoded.userId,
        role: decoded.role,
    };
}