import { db } from "@/firebase";
import { jobApplicationFormSchema } from "@/schema";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import { z } from "zod";

type JobApplication = z.infer<typeof jobApplicationFormSchema>;

type JobApplicationListProps = {
  user: User;
};

export default function JobApplicationList({ user }: JobApplicationListProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);

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
        <JobApplicationCard key={application.uid} application={application} />
      ))}
    </div>
  );
}
