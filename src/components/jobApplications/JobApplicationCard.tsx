import { db } from "@/firebase";
import { jobApplicationFormSchema } from "@/schema";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { z } from "zod";

type JobApplication = z.infer<typeof jobApplicationFormSchema>;

type JobApplicationCardProps = {
  user: User;
};

export default function JobApplicationCard({ user }: JobApplicationCardProps) {
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
    <div className="">
      {applications.map((application) => (
        <div key={application.uid}>
          <h3>{application.position}</h3>
          <p>{application.companyName}</p>
          <p>{application.status}</p>
        </div>
      ))}
    </div>
  );
}
