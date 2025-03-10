"use client";
import React, { useEffect, useRef, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineSend } from "react-icons/ai";
import sendMessage from "../../lib/sendMessage";
import useMessages from "../../lib/useMessages";

const ChatroomPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Stores logged-in user data
  const [newMessage, setNewMessage] = useState(""); // Stores new message input
  const messages = useMessages(); // Fetches messages from Firebase
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  // Handle authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.replace("/"); // Redirect to home if not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Prevent empty messages
    await sendMessage(newMessage, user); // Send message to Firebase
    setNewMessage(""); // Clear input field
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };
  // console.log("User photoURL:", user?.photoURL);
  // console.log("🚀 ~ {messages.map ~ userImage:", userImage)

  console.log("🚀 ~ user:", user)


  return (

    <div className="flex flex-col items-center justify-center h-screen w-full bg-white px-4 md:px-0">
      {!user ? (
        // Show loading spinner if user data is not available
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="w-[600px] border h-full mb-1 mt-1 bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
          {/*  User Info */}
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">Chat App</span>
              <h2 className="text-base text-center font-semibold">
                {user.displayName || user.email.split("@")[0]} | {user.email}
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-semibold cursor-pointer mb-3 mt-1 transition-all duration-300 hover:from-[#15803D] hover:to-[#22C55E]"
            >
              Logout
            </button>
          </div>

          {/*  Chat Messages List */}
          <div className="overflow-y-auto flex-grow max-h-[70vh] p-2 scrollbar-hide">
            {messages.map((message) => {
              // Check if the message is sent by the logged-in user
              const isUserMessage = message.senderId === user?.uid;
              // Default image if sender has no profile photo
              const userImage = (message.senderPhoto && message.senderPhoto !== "undefined")
                ? message.senderPhoto
                : "/user.png";

              return (
                <div key={message.id} className={`flex ${isUserMessage ? "justify-end" : "justify-start"} p-2 my-1`}>
                  {!isUserMessage && (
                    <img src="/user.png" alt="User Avatar" className="w-9 h-9 object-cover rounded-full mr-2" />
                  )}



                  <div className={`flex flex-col ${isUserMessage ? "items-end text-right" : "items-start text-left"}`}>
                    {/* Sender Name & Timestamp */}
                    <div className={`flex items-center space-x-2 text-xs md:text-sm mb-1 ${isUserMessage ? "flex-row-reverse" : ""}`}>
                      <span className="font-bold">{isUserMessage ? "You" : message.sender || "User"}</span> |
                      <span className="text-gray-500">
                        | {message.timestamp?.seconds ? new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    {/* Message Box */}
                    <div
                      className={`p-2 rounded-lg max-w-[80%] break-words text-sm 
      md:text-base leading-relaxed shadow-md 
      ${isUserMessage ? "bg-blue-500 text-white self-end text-right" : "bg-gray-200 text-black self-start text-left"}`}
                      style={{ wordBreak: "break-word", overflowWrap: "break-word", textAlign: isUserMessage ? "right" : "left" }}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>


                  {isUserMessage && (
                    <img
                      src={userImage}
                      alt="User Avatar"
                      className="w-9 h-9 object-cover rounded-full mr-2"
                    />)}
                </div>
              );
            })}
            <div ref={messagesEndRef}></div>
          </div>

          {/*  Message Input Box */}
          <div className="flex items-center mt-2 border-t pt-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-2 border rounded mr-2 text-sm md:text-base"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <AiOutlineSend className="mr-2" /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatroomPage;
