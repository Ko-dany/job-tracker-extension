/* Firebase imports */
import { db } from "@/firebase";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
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
import { toast } from "sonner";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobApplication, jobApplicationFormSchema } from "@/schema";
import { APPLICATION_STATUSES, WORK_TYPES } from "@/constants";

type JobApplicationFormProps = {
  user: User | null;
  onClose: () => void;
  initialData?: JobApplication;
  onUpdateForm: (date: Date) => void;
};

export default function JobApplicationForm({
  user,
  onClose,
  initialData,
  onUpdateForm,
}: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(jobApplicationFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          companyName: "",
          position: "",
          workType: WORK_TYPES[0].value,
          status: APPLICATION_STATUSES[0].value,
          appliedAt: new Date().toISOString().split("T")[0],
          notes: "",
        },
  });

  const { handleSubmit } = form;
  const onSubmit = async (data: JobApplication) => {
    setIsSubmitting(true);
    if (!user) return alert("User data is null!");
    try {
      /* Update existing application */
      if (isEditing && initialData && initialData.uid) {
        const userApplicationsRef = doc(
          db,
          "users",
          user!.uid,
          "applications",
          initialData.uid,
        );
        await updateDoc(userApplicationsRef, {
          ...data,
        });

        toast("Updated Successfully", {
          description: "Your application details have been updated.",
          duration: 5000,
        });
      } /* Create a new application */ else {
        // 1. Store user data in "users" collection
        const userRef = doc(db, "users", user!.uid);
        await setDoc(userRef, {
          uid: user!.uid,
          name: user!.displayName,
          email: user!.email,
        });

        // 2. Store user's application data in "applications" sub-collection under "users"
        const userApplicationsRef = collection(userRef, "applications");
        const docRef = await addDoc(userApplicationsRef, {
          ...data,
          appliedAt: data.appliedAt || new Date().toISOString().split("T")[0],
          notes: data.notes || "",
          createdAt: serverTimestamp(),
        });

        await setDoc(
          docRef,
          {
            uid: docRef.id,
          },
          { merge: true },
        );

        toast("Saved Successfully", {
          description: "Your new application has been saved.",
          duration: 5000,
        });
      }
      const currentTime = new Date();
      onUpdateForm(currentTime);
      onClose();
    } catch (error) {
      toast("Something Went Wrong", {
        description:
          "There was a problem saving your application. Please try again.",
        duration: 5000,
      });
      console.error("Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="form-modal rounded-lg shadow-xl w-1/2 max-w-md max-h-[90h] overflow-auto">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-7">
              <div className="flex justify-between items-center pb-5 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? "Edit Application" : "New Application"}
                </h2>
                <Button onClick={onClose} className="!p-2 form-button ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
              <div className="space-y-5 mt-5">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter company name"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Position *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter job title"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Work Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-white/20 text-white">
                            {WORK_TYPES.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                                className="hover:bg-white/10 focus:bg-white/20"
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Application Status *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-white/20 text-white">
                            {APPLICATION_STATUSES.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                                className="hover:bg-white/10 focus:bg-white/20"
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="appliedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Application Date *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="text-white">Memo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Memo any questions or interview preparations"
                            {...field}
                            className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="form-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-button"
                  >
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
