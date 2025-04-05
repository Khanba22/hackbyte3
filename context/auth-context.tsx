"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  role: "user" | "doctor" | "admin";
};

interface LoginProps {
  email: string;
  password: string;
}

interface LoginResult {
  status: boolean;
  error?: string;
  user?: User;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: LoginProps) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check authentication and redirect if needed
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (!["/", "/auth/register"].includes(pathname)) {
        router.push("/auth/login");
      }
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/fetch-user`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const { user } = await response.json();
      setUser(user);

      // Redirect user based on role
      if (pathname === "/auth/login") {
        if (user.role === "doctor") {
          router.push("/dashboard/doctor");
        } else {
          router.push("/dashboard/user");
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      localStorage.removeItem("token");
      if (!["/", "/auth/register"].includes(pathname)) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Run checkAuth when the app loads and on navigation change
  useEffect(() => {
    checkAuth();
  }, [pathname]); // Runs on every route change

  const login = async ({ email, password }: LoginProps) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      setUser(user);

      // Redirect based on role
      if (user.role === "doctor") {
        router.push("/dashboard/doctor");
      } else {
        router.push("/dashboard/user");
      }

      return { status: true, user };
    } catch (err: any) {
      return { status: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
