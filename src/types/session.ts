// types/session.ts
export interface UserSession {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  // Header.tsx ve UserMenu.tsx'de
  import { UserSession } from '@/types/session';