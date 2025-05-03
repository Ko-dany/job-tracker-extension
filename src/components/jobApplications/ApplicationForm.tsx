import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/firebase";
import { User } from "firebase/auth";

export function ApplicationForm({ user }: { user: User | null }) {
  const initialForm = {
    companyName: "",
    position: "",
    workType: "",
    status: "",
    appliedAt: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const applicationRef = collection(db, "users", user.uid, "applications");

    try {
      await addDoc(applicationRef, {
        ...formData,
        appliedAt: formData.appliedAt ? new Date(formData.appliedAt) : null,
        createdAt: serverTimestamp(),
      });
      alert("Application successfully saved!");
      console.log("Saved data: ", formData);
      setFormData(initialForm);
    } catch (error) {
      alert("Error saving application data.");
      console.error("Error: ", error);
    }
  };

  return (
    <>
      <h2>Welcome, {user!.displayName}!</h2>
      <p>Email: {user!.email}</p>
      <img src={user!.photoURL!} alt="Profile" />
      <form onSubmit={handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </label>
        <label>
          Position:
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </label>
        <label>
          Work Type:
          <input
            type="text"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
          />
        </label>
        <label>
          Application Status:
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </label>
        <label>
          Date Applied:
          <input
            type="date"
            name="appliedAt"
            value={formData.appliedAt}
            onChange={handleChange}
          />
        </label>
        <label>
          Notes:
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </>
  );
}
