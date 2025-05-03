import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { User } from "firebase/auth";

export function ApplicationForm({ user }: { user: User | null }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <form onSubmit={handleSubmit}>
      <h2>Welcome, {user!.displayName}</h2>
      <p>Email: {user!.email}</p>
      <img src={user!.photoURL!} alt="Profile" />
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
  );
}
