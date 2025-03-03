"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/authform");
      } else {
        router.push("/chatroom");
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] 
                      px-4 py-2 rounded-lg text-center font-semibold animate-pulse">
            Loading...
          </p>
        </div>
      </div>

    );

  return <>{children}</>;
}
