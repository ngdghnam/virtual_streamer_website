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
import { addSheetData } from "@/lib/google-sheet.action";

// Phone number validation schema
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(5, { message: "Phone number must be at least 5 digits" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Please enter a valid phone number" }),
});

const EndSectionPhoneForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Format data for Google Sheets
      // We'll include phone number and submission date
      const formattedData = [[values.phoneNumber, new Date().toISOString()]];

      // Call the server action to add data to Google Sheets
      const result = await addSheetData(formattedData);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      console.log("Phone number submitted:", values.phoneNumber);
      setSubmitted(true);

      // Reset form after successful submission
      form.reset();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {submitted ? (
        <div className="text-center py-4 bg-green-50 border border-green-400 text-green-700 px-4 rounded">
          <p className="font-bold mb-2">Cảm ơn bạn!</p>
          <p>Hãy chờ các phần quà hấp dẫn từ chúng mình nhé</p>
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
                      placeholder="(+84) 000 000 000"
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
