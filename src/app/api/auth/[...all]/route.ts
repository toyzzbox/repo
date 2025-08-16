// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";

// Tüm HTTP metodları auth.handleRequest ile yönlendir
export const GET = auth.handleRequest;
export const POST = auth.handleRequest;
export const PUT = auth.handleRequest;
export const DELETE = auth.handleRequest;
export const PATCH = auth.handleRequest;
export const OPTIONS = auth.handleRequest;
