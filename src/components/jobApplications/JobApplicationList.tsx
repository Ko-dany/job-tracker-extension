import { db } from "@/firebase";
import { JobApplication } from "@/schema";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationForm from "./JobApplicationForm";
import { Toaster } from "sonner";

type JobApplicationListProps = {
  user: User;
};

export default function JobApplicationList({ user }: JobApplicationListProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [editData, setEditData] = useState<JobApplication | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

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
  }, [user, lastUpdated]);

  return (
    <div>
      <button
        onClick={() => {
          setShowNewForm(true);
          setEditData(null);
        }}
        className="form-button"
      >
        New Application
      </button>
      {applications.map((application) => (
        <JobApplicationCard
          user={user}
          key={application.uid}
          application={application}
          setShowEditForm={(show: boolean) => setShowEditForm(show)}
          setInitialData={(application: JobApplication) =>
            setEditData(application)
          }
          onUpdateForm={(date: Date) => setLastUpdated(date)}
        />
      ))}
      {/* Job Application Form modal */}
      {showNewForm && (
        <JobApplicationForm
          onClose={() => setShowNewForm(false)}
          user={user}
          onUpdateForm={(date: Date) => setLastUpdated(date)}
        />
      )}
      {showEditForm && (
        <JobApplicationForm
          onClose={() => setShowEditForm(false)}
          user={user}
          initialData={editData!}
          onUpdateForm={(date: Date) => setLastUpdated(date)}
        />
      )}
      <Toaster />
    </div>
  );
}
