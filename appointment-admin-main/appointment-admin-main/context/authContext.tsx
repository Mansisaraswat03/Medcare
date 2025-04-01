"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  auth_token: string | null;
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth_token, setAuthToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ auth_token, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}