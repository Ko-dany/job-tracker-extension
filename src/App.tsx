import { useState } from "react";
import { db, auth, addDoc, collection } from "./firebase";
import { User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((data) => {
        console.log(data);
        const user = data.user;
        setUser(user);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "names"), {
        name,
        timestamp: new Date(),
      });
      setSuccess(true);
      setName("");
    } catch (error) {
      console.error("Error saving name:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>Job Application Tracker</h1>
        {user ? (
          <form onSubmit={handleSubmit}>
            <h2>Welcome, {user.displayName}</h2>
            <p>Email: {user.email}</p>
            <img src={user.photoURL!} alt="Profile" />
            <br />
            <label>
              Name:{" "}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            {success && <p style={{ color: "green" }}>Saved successfully!</p>}
          </form>
        ) : (
          <div>
            <button onClick={handleGoogleLogin}>Login in Google</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
