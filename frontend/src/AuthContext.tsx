import { ReactNode, createContext, useEffect, useState } from "react";
import api from "./api";

type AuthContextType = {
  user: unknown;
  setUser: (data: unknown) => void;
} | null;

export const AuthContext = createContext<AuthContextType>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null as unknown);

  useEffect(() => {
    api
      .get("/")
      .then(({ data }) => setUser(data))
      .catch((err) => console.error(err));

    return () => {};
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
