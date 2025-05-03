import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/firebase";
import { jobApplicationFormSchema } from "@/schema";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type JobApplicationFormProps = {
  onClose: () => void;
};

type FormData = z.infer<typeof jobApplicationFormSchema>;

const WORK_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
  { value: "Co-op", label: "Co-op" },
];

const APPLICATION_STATUSES = [
  { value: "Submitted", label: "Submitted", color: "blue" },
  { value: "Reviewing", label: "Reviewing", color: "amber" },
  { value: "Accepted", label: "Accepted", color: "green" },
  { value: "Interviewing", label: "Interviewing", color: "green" },
  { value: "Interviewed", label: "Interviewed", color: "purple" },
  { value: "Offered", label: "Offered", color: "emerald" },
  { value: "Rejected", label: "Rejected", color: "red" },
];

export default function JobApplicationForm({
  onClose,
}: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({ resolver: zodResolver(jobApplicationFormSchema) });
  const { handleSubmit } = form;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        companyName: data.companyName,
        position: data.position,
        workType: data.workType,
        status: data.status,
        appliedAt: data.appliedAt || "",
        notes: data.notes || "",
        createdAt: serverTimestamp(),
      });

      alert("Application successfully saved!");
    } catch (error) {
      alert("Error saving application data.");
      console.error("Error: ", error);
    }
  };

  return (
    <>
      <div>
        <div>
          <div>
            <h2>New Application</h2>
            <Button onClick={onClose}>X</Button>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <FormField
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormField
                    name="workType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WORK_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {APPLICATION_STATUSES.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="appliedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  render={({ field }) => {
                    // Ensure null values are converted to empty strings for Textarea
                    const safeValue = field.value === null ? "" : field.value;

                    return (
                      <FormItem>
                        <FormLabel>Memo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Memo any questions or interview preparations"
                            {...field}
                            value={safeValue}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div>
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
