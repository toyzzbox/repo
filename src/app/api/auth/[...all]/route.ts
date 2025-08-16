import { auth } from "@/lib/auth";

// GET ve POST için auth handler kullan
export const GET = auth.handleRequest;
export const POST = auth.handleRequest;
