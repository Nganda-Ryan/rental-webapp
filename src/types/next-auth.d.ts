import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    permissions: any[];
    token: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      permissions: any[];
      firebase_token: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions: any[];
    firebase_token: string;
  }
}