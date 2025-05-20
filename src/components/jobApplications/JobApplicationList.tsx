import { db } from "@/firebase";
import { JobApplication } from "@/schema";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationForm from "./JobApplicationForm";

type JobApplicationListProps = {
  user: User;
};

export default function JobApplicationList({ user }: JobApplicationListProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialData, setInitialData] = useState<JobApplication | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await getDocs(collection(db, "users", user!.uid, "applications")).then(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data() as JobApplication);
          setApplications(data);
        },
      );
    };

    fetchData();
  }, [user]);

  return (
    <div>
      {applications.map((application) => (
        <JobApplicationCard
          key={application.uid}
          application={application}
          setShowForm={setShowForm}
          setInitialData={setInitialData}
        />
      ))}
      {/* Job Application Form modal */}
      {showForm && (
        <JobApplicationForm
          onClose={() => setShowForm(false)}
          user={user}
          initialData={initialData!}
        />
      )}
    </div>
  );
}
