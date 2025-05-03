import { useEffect, useState } from "react";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { ApplicationForm } from "./components/ApplicationForm";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
        else setUser(null);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  return (
    <>
      <div>
        <h1>Job Application Tracker</h1>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <ApplicationForm user={user} />
        ) : (
          <GoogleLoginButton onLogin={setUser} />
        )}
      </div>
    </>
  );
}

export default App;
