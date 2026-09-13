import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Providers } from "./providers";
export const metadata = { title: "Portfolia — Portfolio Builder", description: "Build a professional portfolio without code." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers><AuthProvider>{children}</AuthProvider></Providers></body></html>; }
