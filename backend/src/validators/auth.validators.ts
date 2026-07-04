export function validateRegisterInput(username: string, email: string, password: string) {
    if (!username || !email || !password) {
        throw new Error("Username, email and password are required");
    }

    if (username.length < 3) {
        throw new Error("Username must have at least 3 characters");
    }

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }

    if (password.length < 6) {
        throw new Error("Password must have at least 6 characters");
    }
}

export function validateLoginInput(email: string, password: string) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }
}