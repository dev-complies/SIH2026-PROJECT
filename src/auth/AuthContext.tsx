"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import {
  DEMO_USERS,
  toUserEntity,
  authenticateDemoUser,
  setClientSession,
  clearClientSession,
  getClientSession,
} from "./session";
import { hasPermission as checkPermission, isRouteAuthorized, Permission } from "./permissions";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  loginAsDemoUser: (userId: string) => void;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (pathname: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    const existing = getClientSession();
    if (existing) {
      setCurrentUser(existing);
    } else {
      // Default initial session: Government Officer
      const defaultUser = toUserEntity(DEMO_USERS[1]);
      setCurrentUser(defaultUser);
      setClientSession(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const user = authenticateDemoUser(email, password);
    if (!user) {
      setIsLoading(false);
      return { success: false, error: "Invalid credentials. Use a demo user account or Password123!" };
    }
    setCurrentUser(user);
    setClientSession(user);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    clearClientSession();
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      const userEntity = toUserEntity(matched);
      setCurrentUser(userEntity);
      setClientSession(userEntity);
    }
  };

  const loginAsDemoUser = (userId: string) => {
    const matched = DEMO_USERS.find((u) => u.id === userId);
    if (matched) {
      const userEntity = toUserEntity(matched);
      setCurrentUser(userEntity);
      setClientSession(userEntity);
    }
  };

  const hasPerm = (permission: Permission): boolean => {
    return checkPermission(currentUser, permission);
  };

  const canAccess = (pathname: string): boolean => {
    return isRouteAuthorized(pathname, currentUser?.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        login,
        logout,
        switchRole,
        loginAsDemoUser,
        hasPermission: hasPerm,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
