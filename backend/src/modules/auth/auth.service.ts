import bcrypt from "bcrypt";
import { createToken } from "../../utils/jwt.js";
import { findUserByEmail, findUserByEmailOrUsername, findUserById, insertUser } from "./auth.repository.js";
import { validateLoginInput, validateRegisterInput } from "../../validators/auth.validators.js";

type RegisterInput = {
    username: string
    email: string
    password: string
};

type LoginInput = {
    email: string,
    password: string
};

export async function registerUser({ username, email, password }: RegisterInput) {
    validateRegisterInput(username, email, password);

    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser) {
        throw new Error("Email or username already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await insertUser(username, email, passwordHash);

    const token = createToken({
        userId: user.id,
        role: user.role,
    })

    return {
        user,
        token,
    }
};

export async function loginUser({ email, password }: LoginInput) {
    validateLoginInput(email, password);

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = createToken({
        userId: user.id,
        role: user.role,
    });

    const { password_hash, ...safeUser } = user;

    return {
        user: safeUser,
        token,
    }
};

export async function getUserById(id: string) {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("User not found")
    }
    
    return user;
};