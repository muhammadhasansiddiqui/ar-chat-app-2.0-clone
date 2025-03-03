"use client";
import { useState } from "react";
import { auth, sendPasswordResetEmail } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage(""); // Reset message before new request

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
      setEmail(""); // Clear email field
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and we'll send a reset link.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full p-2  h-9 mb-3 rounded  text-gray-800
            border border-gray-300 focus:border-[#16A34A] focus:outline-none transition-all duration-300
            focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"            required
          />
          <button
            type="submit"
            className="w-full bg-[#16A34A] hover:bg-gradient-to-r from-[#16A34A] to-[#15803D]  text-white font-bold py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <div className="mt-4 text-center">
          <Link href="/authform" className=" hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
