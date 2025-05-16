import { jobApplicationFormSchema } from "@/schema";
import { Briefcase, Calendar } from "lucide-react";
import { z } from "zod";

type JobApplication = z.infer<typeof jobApplicationFormSchema>;

type JobApplicationCardProps = {
  application: JobApplication;
};

export default function JobApplicationCard({
  application,
}: JobApplicationCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-ccenter justify-between">
      <div>
        <h3 className="text-lg font-medium text-white truncate">
          {application.companyName}
        </h3>
        <p className="text-sm font-medium test-white/80 truncate">
          {application.position}
        </p>
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center text-xs text-white/70">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{application.appliedAt}</span>
          </div>
          <div className="flex items-center text-xs text-white/70">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>{application.workType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
