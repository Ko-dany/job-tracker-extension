/* Firebase imports */
import { db } from "@/firebase";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

/* UI imports */
import { Button } from "@/components/ui/button";
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

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobApplicationFormSchema } from "@/schema";
import { APPLICATION_STATUSES, WORK_TYPES } from "@/constants";

type JobApplicationFormProps = {
  user: User | null;
  onClose: () => void;
};

type FormData = z.infer<typeof jobApplicationFormSchema>;

export default function JobApplicationForm({
  user,
  onClose,
}: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({ resolver: zodResolver(jobApplicationFormSchema) });
  const { handleSubmit } = form;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    if (!user) return alert("User data is null!");
    try {
      // Store user data in "users" collection
      const userRef = doc(db, "users", user!.uid);
      await setDoc(userRef, {
        uid: user!.uid,
        name: user!.displayName,
        email: user!.email,
      });

      // Store user's application data in "applications" sub-collection under "users"
      const userApplicationsRef = collection(userRef, "applications");
      await addDoc(userApplicationsRef, {
        ...data,
        appliedAt: data.appliedAt || new Date().toISOString().split("T")[0],
        notes: data.notes || "",
        createdAt: serverTimestamp(),
        uid: userApplicationsRef.id,
      });

      form.reset({
        companyName: "",
        position: "",
        workType: "",
        status: "",
        appliedAt: new Date().toISOString().split("T")[0],
        notes: "",
      });

      alert("Application successfully saved!");
    } catch (error) {
      alert("Error saving application data.");
      console.error("Error: ", error);
    } finally {
      setIsSubmitting(false);
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
                          value={field.value}
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
                          value={field.value}
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
                    return (
                      <FormItem>
                        <FormLabel>Memo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Memo any questions or interview preparations"
                            {...field}
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
