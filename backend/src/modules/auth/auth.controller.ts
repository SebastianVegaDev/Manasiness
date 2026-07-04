import type { RequestHandler } from "express";
import { loginUser, registerUser } from "./auth.service.js";

const COOKIE_NAME = "devjudge_token";

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message
    }

    return "Internal server error";
}

function getStatusCode(message: string) {
    if (
        message.includes("required") ||
        message.includes("Invalid") ||
        message.includes("characters")
    ) {
        return 400;
    }

    if (message.includes("already exists")) {
        return 409;
    }

    return 500;
}

export const registerController: RequestHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const { user, token } = await registerUser({
            username,
            email,
            password,
        });

        res.cookie(COOKIE_NAME, token, cookieOptions);

        res.status(201).json({
            user,
        });
    } catch (error) {
        const message = getErrorMessage(error);

        res.status(getStatusCode(message)).json({
            message,
        });
    }
}

export const loginController: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await loginUser({
            email,
            password,
        });

        res.cookie(COOKIE_NAME, token, cookieOptions);

        res.json({
            user,
        });
    } catch (error) {
        const message = getErrorMessage(error);

        res.status(401).json({
            message,
        });
    }
};

export const logoutController: RequestHandler = async (_req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    res.json({
        message: "Logged out successfully",
    });
};

export const meController: RequestHandler = (_req, res) => {
    res.json({
        user: res.locals.user,
    });
};