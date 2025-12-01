"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  LoginFormData,
  RegisterFormData,
  AuthResponse,
} from "@/types/auth";
import { usePathname, useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/app/store/authStore";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);
  const pathName = usePathname();
  const publicRoute = ["/login", "/register"];
  const isPublicRoute = publicRoute.includes(pathName);
  const router = useRouter();

  useEffect(() => {
    if (!isPublicRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isPublicRoute]);

  const checkAuth = async () => {
    try {
      const userData: AuthResponse = await authAPI.currentUser();
      setUser(userData.user);
      //optionally checking for token expiry and refresh
      if (userData.status === 401 || userData.status === 403) {
        console.log(userData.status + " from auth context");
        const refreshRes = await authAPI.refreshToken();
        if (refreshRes.success) {
          // Retry original request
          const retryRes = await authAPI.currentUser();
          setUser(retryRes.user);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  //login
  const login = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user.name));
    } finally {
      setLoading(false);
    }
  };
  //register
  const register = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user.name));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await authAPI.logout();
    localStorage.removeItem("user");
    router.push("/login");
  };
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
