"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

// Context oluştur
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider component
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session'ı server'dan al
  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include", // Cookie'leri gönder
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session fetch error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda session'ı kontrol et
  useEffect(() => {
    fetchSession();
  }, []);

  // Login fonksiyonu
  const login = (userData: User) => {
    setUser(userData);
  };

  // Logout fonksiyonu
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      // Login sayfasına yönlendir
      window.location.href = "/login";
    }
  };

  // Session'ı yenile
  const refreshSession = async () => {
    setIsLoading(true);
    await fetchSession();
  };

  const value: SessionContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook - Session context'ini kullanmak için
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// Auth guard hook - Protected route'lar için
export function useRequireAuth() {
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);

  return { user, isLoading };
}