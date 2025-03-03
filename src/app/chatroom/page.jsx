"use client";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";

const ChatroomPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Logged-in user state
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", timestamp: "10:30 AM", type: "received" },
    { id: 2, text: "Hi! How are you?", timestamp: "10:31 AM", type: "sent" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Firebase Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Send Message Function
  const sendMessage = () => {
    if (newMessage.trim() === "") return; // Empty message check

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "sent",
    };

    setMessages([...messages, newMsg]);
    setNewMessage(""); // Clear input after sending
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!user ? (
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="w-[600px] border bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
          {/* ✅ User Info */}
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Image
                src={user.photoURL || "/user.png"}
                alt="User Profile"
                width={50}
                height={50}
                className="rounded-full border shadow"
              />
              <h2 className="text-lg font-semibold">{user.displayName || user.email.split("@")[0]}</h2>
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-semibold">
              Logout
            </button>
          </div>

          {/* ✅ Chat Messages */}
          <div className="overflow-y-auto flex-grow max-h-[400px] p-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-center p-2 my-1 ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
                {message.type === "received" && (
                  <img src="/user.png" alt="Avatar" className="w-8 h-8 object-cover rounded-full mr-2" />
                )}
                <div className={`p-3 rounded-lg ${message.type === "sent" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                  {message.text}
                  <div className={`text-xs text-right mt-1 ${message.type === "sent" ? "text-gray-300" : "text-gray-500"}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Message Input */}
          <div className="flex items-center mt-2 border-t pt-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded mr-2"
            />
            <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <AiOutlineSend className="mr-2" /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatroomPage;
