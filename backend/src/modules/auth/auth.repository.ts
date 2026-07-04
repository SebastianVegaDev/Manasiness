import { pool } from "../../config/db.js";

export async function findUserByEmailOrUsername(email: string, username: string) {
    const { rows } = await pool.query(`
        SELECT id FROM users WHERE email = $1 OR username = $2;
    `, [email, username]);

    return rows[0];
};

export async function findUserByEmail(email: string) {
    const { rows } = await pool.query(`
        SELECT id, username, email, password_hash, role, created_at
        FROM users
        WHERE email = $1;
    `, [email]);

    return rows[0];
};

export async function findUserById(id: string) {
    const { rows } = await pool.query(`
        SELECT id, username, email, role, created_at
        FROM users
        WHERE id = $1
    `, [id]);

    return rows[0];
};

export async function insertUser(username: string, email: string, passwordHash: string ) {
    const { rows } = await pool.query(`
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, role, created_at;
    `, [username, email, passwordHash, "user"]);

    return rows[0];
};