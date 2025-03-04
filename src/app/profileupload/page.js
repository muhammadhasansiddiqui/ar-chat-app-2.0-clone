import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

const ProfileUpload = () => {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const storage = getStorage();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleUpload = async (e) => {
        if (!user) {
            console.error("User is not logged in");
            return;
        }

        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Upload failed:", error);
                setLoading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await updateProfile(auth.currentUser, { photoURL: downloadURL });
                await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });
                setPhoto(downloadURL);
                setLoading(false);
            }
        );
    };

    return (
        <div>
            <label className="block mb-2">
                Profile Picture
                <input type="file" accept="image/*" onChange={handleUpload} className="w-full p-2 rounded border border-gray-300 mb-3" required />
            </label>
            {loading && <p>Uploading...</p>}
            {photo && <img src={photo} alt="Profile" className="w-16 h-16 rounded-full" />}
        </div>
    );
};

export default ProfileUpload;
