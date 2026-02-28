import { SessionOptions } from "iron-session";

export interface SessionData {
    isAdmin: boolean;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || "fallback-secret-32-chars-minimum!!",
    cookieName: "mochi-admin-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
};
