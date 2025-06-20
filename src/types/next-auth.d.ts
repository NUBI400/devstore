import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: Role;
  }
} 