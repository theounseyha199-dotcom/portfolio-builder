"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { keycloak } from "@/lib/keycloak";
type AuthContextValue = { ready: boolean; authenticated: boolean; login: () => void; logout: () => void };
const AuthContext = createContext<AuthContextValue>({ ready: false, authenticated: false, login: () => {}, logout: () => {} });
export function AuthProvider({ children }: { children: React.ReactNode }) { const [ready, setReady] = useState(false); const [authenticated, setAuthenticated] = useState(false); useEffect(() => { keycloak.init({ onLoad: "check-sso", pkceMethod: "S256", checkLoginIframe: false }).then((value) => { setAuthenticated(value); setReady(true); }).catch(() => setReady(true)); }, []); return <AuthContext.Provider value={{ ready, authenticated, login: () => keycloak.login({ redirectUri: `${window.location.origin}/dashboard` }), logout: () => keycloak.logout({ redirectUri: window.location.origin }) }}>{children}</AuthContext.Provider>; }
export const useAuth = () => useContext(AuthContext);

