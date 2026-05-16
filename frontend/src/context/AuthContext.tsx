import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMe, loginRequest, registerRequest, resetPasswordRequest } from "../api/services";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { fullName: string; email: string; phone?: string; password: string }) => Promise<void>;
  resetPassword: (payload: { token: string; password: string }) => Promise<void>;
  setSession: (payload: { user: User; token: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("elegant_beauty_token"));
  const [user, setUser] = useState<User | null>(null);

  const meQuery = useQuery({
    queryKey: ["me", token],
    queryFn: fetchMe,
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
    if (meQuery.isError) {
      localStorage.removeItem("elegant_beauty_token");
      setToken(null);
      setUser(null);
    }
  }, [meQuery.data, meQuery.isError]);

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: ({ user: nextUser, token: nextToken }) => {
      localStorage.setItem("elegant_beauty_token", nextToken);
      setToken(nextToken);
      setUser(nextUser);
    }
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: ({ user: nextUser, token: nextToken }) => {
      localStorage.setItem("elegant_beauty_token", nextToken);
      setToken(nextToken);
      setUser(nextUser);
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: ({ user: nextUser, token: nextToken }) => {
      localStorage.setItem("elegant_beauty_token", nextToken);
      setToken(nextToken);
      setUser(nextUser);
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading: meQuery.isLoading || loginMutation.isPending || registerMutation.isPending || resetPasswordMutation.isPending,
      login: async (payload) => {
        await loginMutation.mutateAsync(payload);
      },
      register: async (payload) => {
        await registerMutation.mutateAsync(payload);
      },
      resetPassword: async (payload) => {
        await resetPasswordMutation.mutateAsync(payload);
      },
      setSession: ({ user: nextUser, token: nextToken }) => {
        localStorage.setItem("elegant_beauty_token", nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("elegant_beauty_token");
        setToken(null);
        setUser(null);
      }
    }),
    [loginMutation, meQuery.isLoading, registerMutation, resetPasswordMutation, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
