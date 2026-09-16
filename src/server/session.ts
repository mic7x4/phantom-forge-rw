import { useSession } from "@tanstack/react-start/server";

export type AdminSession = {
  email?: string;
  role?: "admin";
};

export function useAdminSession() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters");
  }

  return useSession<AdminSession>({
    name: "phantom-admin-session",
    password,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  });
}
