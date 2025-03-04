"use client";

import { useState } from "react";
import GoogleLogo from "../../images/google-logo.png";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthGuard from "@/context/AuthContext";
import ProfileUpload from "../profileupload/page";





export default function AuthForm() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    // 🔹 Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // ✅ Store user data in Firestore if new user
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL || "",
                createdAt: new Date(),
            }, { merge: true });

            console.log("🚀 ~ handleGoogleSignIn ~ user", user);
            toast.success("Login Successful with Google!");
            router.push("/chatroom");
        } catch (error) {
            toast.error(error.message);
        }
    };

    // handle Auth sign-in
    const handleAuth = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
    
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Invalid email format.");
            return;
        }
    
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
    
        try {
            let result;
            if (isLogin) {
                result = await signInWithEmailAndPassword(auth, email, password);
                
                toast.success("Login Successful!");
                console.log("🚀 ~ handleAuth ~ isLogin:", isLogin)

            } else {
                result = await createUserWithEmailAndPassword(auth, email, password);
                const user = result.user;
                toast.success("Signup Successful!");
                
    
                await updateProfile(user, {
                    displayName: userName,
                    photoURL: photoURL || "",
                });
                console.log("Updated User Profile:", user);
                
    
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: userName,
                    email: user.email,
                    photoURL: photoURL || "",
                    createdAt: new Date(),
                });
    
                toast.success("Signup Successful!");
            }
            router.push("/chatroom");
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    return (

        <AuthGuard>

        <div className="flex flex-col gap-6 w-full min-h-svh items-center justify-center">
            <div className="bg-card text-card-foreground rounded-xl border border-gray-300 bg-white shadow-2xl p-8 w-96">
                <h2 className="text-2xl font-semibold text-left mb-4">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>
                <p className="text-left text-gray-400 mb-6">
                    {isLogin ? "Enter your email and password to log in to your account"
                        : "Create your account by entering your details below"}
                </p>

                {!isLogin && (
                    <label className="block mb-2">
                        User Name
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-2 mb-3 rounded h-9 text-gray-800 border border-gray-300 
                            focus:border-[#16A34A] focus:outline-none transition-all duration-300
                            focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"
                        />
                    </label>
                )}

                <label className="block mb-2">
                    Email
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 h-9 mb-3 rounded text-gray-800 border border-gray-300 
                        focus:border-[#16A34A] focus:outline-none transition-all duration-300
                        focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"
                    />
                </label>

                <label className="block mb-2">
                    <div className="flex justify-between items-center">
                        <span>Password</span>
                        <a href="/forgetpassword" className="text-sm hover:underline">
                            Forgot your password?
                        </a>
                    </div>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 h-9 mt-1 rounded text-gray-800 border border-gray-300 
                        focus:border-[#16A34A] focus:outline-none transition-all duration-300
                        focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"
                    />
                </label>

                {!isLogin && (
                    <ProfileUpload />
                )}

                <button
                    onClick={handleAuth}
                    className="w-full p-2 rounded bg-gradient-to-r from-[#16A34A] to-[#15803D] 
                    text-white font-semibold cursor-pointer mb-3 mt-1 
                    transition-all duration-300 hover:from-[#15803D] hover:to-[#22C55E]"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                {/* 🔹 Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full p-2 flex justify-center items-center gap-2 rounded border border-gray-300 bg-white
                    text-gray-800 font-semibold cursor-pointer mb-3 mt-1 transition-all duration-300
                    hover:bg-gray-100"
                >
                    <Image src={GoogleLogo} alt="Google Logo" width={20} height={20} />
                    Continue with Google
                </button>

                <p
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-center text-gray-800 cursor-pointer hover:underline"
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </p>
            </div>
            <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
        </div>

        </AuthGuard>
    );
}
