"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/authform"); // User ko login page par bhej do
  }, []);

  return  <div className="flex items-center justify-center h-screen">
  <div className="flex flex-col items-center gap-2">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <p className="text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] 
                  px-4 py-2 rounded-lg text-center font-semibold animate-pulse">
     Redirecting...
    </p>
  </div>
</div>;
}
