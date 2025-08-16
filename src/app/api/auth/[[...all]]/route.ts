// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";

// Next.js App Router uyumlu handler
export const { GET, POST, PUT, PATCH, DELETE, OPTIONS } = auth.handleRequest;
