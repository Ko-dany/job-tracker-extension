import { User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";

interface GoogleLoginButtonType {
  onLogin: (user: User | null) => void;
}

export function GoogleLoginButton({ onLogin }: GoogleLoginButtonType) {
  const firestoreDb = getFirestore();

  const saveUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(firestoreDb, "users", user.uid);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      console.log("Successfully saved user data to Firestore.");
    } catch (error) {
      console.log("Error saving user to Firestore: ", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((data) => {
        const user = data.user;
        onLogin(user);
        saveUserToFirestore(user);
        console.log("Google user data: ", data);
      })
      .catch((error) => console.log("Error during Google login: ", error));
  };
  return <button onClick={handleGoogleLogin}>Login in Google</button>;
}
