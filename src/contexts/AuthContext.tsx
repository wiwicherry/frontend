import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;

  mobile?: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const setUserInfo = (info: UserInfo | null) => {
    setUserInfoState(info);
    if (info) {
      localStorage.setItem("userInfo", JSON.stringify(info));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  const logout = () => {
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
