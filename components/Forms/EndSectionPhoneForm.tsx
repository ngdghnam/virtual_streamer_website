// components/EndSectionPhoneForm.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Phone number validation schema
const formSchema = z.object({
  phoneNumber: z
    .string()
    .max(10, { message: "Phone number must be at 10 digits" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Please enter a valid phone number" }),
});

const EndSectionPhoneForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Phone number submitted:", values.phoneNumber);
      setIsSubmitting(false);
      setSubmitted(true);

      // Optional: Reset form after submission
      // form.reset()
    }, 1000);
  }

  return (
    <div className="rounded-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      {submitted ? (
        <div className="text-center py-4">
          <p className="text-green-600 mb-2">Thank you!</p>
          <p>Your phone number has been submitted successfully.</p>
          <Button
            className="mt-4"
            onClick={() => {
              setSubmitted(false);
              form.reset();
            }}
          >
            Submit another number
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      type="tel"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your phone number including country code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EndSectionPhoneForm;
