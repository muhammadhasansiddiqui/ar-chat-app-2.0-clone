import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const sendMessage = async (text, user) => {
  if (!text.trim()) return;

  try {
    await addDoc(collection(db, "messages"), {
      text,
      sender: user.displayName || user.email.split("@")[0],
      senderId: user.uid,
      senderPhoto: user.photoURL || "/user.png",

      timestamp: serverTimestamp(),
    });
      console.log("🚀 ~ awaitaddDoc ~ sender:", sender)
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default sendMessage; 