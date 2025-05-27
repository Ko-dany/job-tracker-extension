import { JobApplication } from "@/schema";
import { Briefcase, Calendar, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { APPLICATION_STATUSES } from "@/constants";

type JobApplicationCardProps = {
  application: JobApplication;
  setShowEditForm: (show: boolean) => void;
  setInitialData: (data: JobApplication) => void;
};

export default function JobApplicationCard({
  application,
  setShowEditForm,
  setInitialData,
}: JobApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="job-card min-w-[385px]">
      <div className="flex flex-col sm:flex-row sm:items-ccenter justify-between cursor-pointer">
        <div
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className="flex-1 min-w-0"
        >
          {/* Company & Position */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-lg font-medium text-white truncate">
              {application.companyName}
            </h3>
            <p className="text-sm font-medium test-white/80 truncate">
              {application.position}
            </p>
          </div>
          {/* Applied Date & Work Type */}
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
        {/* Status */}
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <span>{application.status}</span>
          <Button
            onClick={() => {
              setShowEditForm(true);
              console.log("setShowEditForm is turned to True");
              setInitialData(application);
            }}
            className="form-button !p-2"
          >
            <Pencil className="h-4 w-4 text-white/80" />
          </Button>
        </div>
      </div>
      {/* Expanded */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {/* Notes */}
          {application.notes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/90 mb-1">Notes</h4>
              <p className="text-sm text-white/70 whitespace-pre-line p-3 bg-black/20 rounded-md truncate">
                {application.notes}
              </p>
            </div>
          )}
          {/* Quick Status Change */}
          <div>
            <h4 className="text-sm font-medium text-white/90 mb-2">
              Status Change
            </h4>
            <div className="flex flex-wrap gap-2">
              {APPLICATION_STATUSES.map((status) => (
                <Button
                  key={status.value}
                  className={`text-xs ${status.value === application.status ? `bg-${status.color}-500/30 hover:bg-${status.color}-500/50 text-white border-1` : "form-button"}`}
                >
                  {status.value}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
