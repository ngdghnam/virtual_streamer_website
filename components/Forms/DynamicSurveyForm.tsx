// components/DynamicSurveyForm.tsx
"use client";

import { useEffect, useState } from "react";
import { getN8nWorkflowData, PostN8nWorkflowData } from "@/service/N8NService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { SurveyQuestion } from "@/types/survey";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useSurveyData } from "@/hooks/use-fetch";

import DemographicStep from "./Steps/DemographicStep";
import PreliminaryStep from "./Steps/PreliminaryStep";
import BranchDetailsStep from "./Steps/BranchDetailsStep";
import OpenEndedQuestionStep from "./Steps/OpenEndedQuestionStep";

function DynamicSurveyForm() {
  // Use the custom hook instead of the direct state and useEffect
  const { surveyData, loading, error } = useSurveyData();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentOpenEndedIndex, setCurrentOpenEndedIndex] = useState(0);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear any submit errors when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate responses if needed
    const validateResponses = () => {
      // Implement validation logic here if required
      // For example, check if all required questions are answered
      return true;
    };

    if (!validateResponses()) {
      setSubmitError("Please answer all required questions.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the data for submission
      const submissionData = {
        responses: responses,
        completedAt: new Date().toISOString(),
      };

      // Submit the data
      await postN8nWorkflowData(submissionData);

      // Handle successful submission
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting survey:", err);
      setSubmitError(
        "There was an error submitting your responses. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const organizeQuestionsByType = () => {
    return surveyData.reduce(
      (
        acc: { [x: string]: unknown[] },
        question: { type: string | number }
      ) => {
        acc[question.type] = acc[question.type] || [];
        acc[question.type].push(question);
        return acc;
      },
      {} as Record<string, SurveyQuestion[]>
    );
  };

  const handleNextOpenEndedQuestion = () => {
    const openEndedQuestions = questionsByType["open-ended"] || [];
    if (currentOpenEndedIndex < openEndedQuestions.length - 1) {
      setCurrentOpenEndedIndex(currentOpenEndedIndex + 1);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading survey questions...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  const questionsByType = organizeQuestionsByType();

  // If the survey has been successfully submitted
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card className="shadow-sm bg-[#FAF8F8] p-8">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <p className="text-gray-600">
              Your survey has been successfully submitted.
            </p>
            <Button
              onClick={() => {
                setResponses({});
                setSubmitted(false);
              }}
              variant="outline"
            >
              Submit Another Response
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <DemographicStep
          questionsByType={questionsByType}
          responses={responses}
          handleResponseChange={handleResponseChange}
        />

        <PreliminaryStep
          questionsByType={questionsByType}
          responses={responses}
          handleResponseChange={handleResponseChange}
        />

        <BranchDetailsStep
          questionsByType={questionsByType}
          responses={responses}
          handleResponseChange={handleResponseChange}
        />

        <OpenEndedQuestionStep
          questionsByType={questionsByType}
          responses={responses}
          handleResponseChange={handleResponseChange}
          currentOpenEndedIndex={currentOpenEndedIndex}
          setCurrentOpenEndedIndex={setCurrentOpenEndedIndex}
          handleNextOpenEndedQuestion={handleNextOpenEndedQuestion}
        />

        {/* Error message display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{submitError}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-lg font-medium mt-8"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Survey"
          )}
        </Button>
      </form>
    </div>
  );
}

const SurveySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="mb-8 shadow-sm hover:shadow-md transition-shadow duration-300 bg-[#FAF8F8]">
    <CardHeader className="border-b ">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 pt-6">{children}</CardContent>
  </Card>
);

export default DynamicSurveyForm;
