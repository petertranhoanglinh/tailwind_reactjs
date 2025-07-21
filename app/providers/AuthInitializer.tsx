// app/providers/AuthInitializer.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useStore } from "react-redux";
import { useRouter } from "next/navigation";
import { restoreAuth } from "../_stores/auth/authSlice";

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        store.dispatch(restoreAuth({ 
          token, 
          user: JSON.parse(user) 
        }));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [store]);

  return <>{children}</>;
}