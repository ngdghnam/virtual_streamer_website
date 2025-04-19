// components/DynamicSurveyForm.tsx
"use client";

import { useEffect, useState } from "react";
import { getN8nWorkflowData, postN8nWorkflowData, putN8nWorkflowData } from "@/service/N8NService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyQuestion } from "@/types/survey";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

function DynamicSurveyForm() {
  const [surveyData, setSurveyData] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentOpenEndedIndex, setCurrentOpenEndedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getN8nWorkflowData();
        setSurveyData(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load survey questions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return surveyData.reduce((acc, question) => {
      acc[question.type] = acc[question.type] || [];
      acc[question.type].push(question);
      return acc;
    }, {} as Record<string, SurveyQuestion[]>);
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
        {/* Single Choice */}
        {questionsByType["single-choice"] && (
          <SurveySection title="Single Choice Questions">
            {questionsByType["single-choice"].map((q) => (
              <div key={q.question_id} className="space-y-4 py-2">
                <Label
                  htmlFor={q.question_id}
                  className="text-base font-medium"
                >
                  {q.question_text}
                </Label>
                <RadioGroup
                  onValueChange={(val) =>
                    handleResponseChange(q.question_id, val)
                  }
                  value={responses[q.question_id]}
                  className="mt-2 space-y-2 "
                >
                  {q.options.split(",").map((option) => {
                    const trimmed = option.trim();
                    const id = `${q.question_id}-${trimmed}`;
                    return (
                      <div
                        key={id}
                        className="flex items-center space-x-3 p-2 rounded-md"
                      >
                        <RadioGroupItem
                          value={trimmed}
                          id={id}
                          className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                        <Label htmlFor={id} className="cursor-pointer">
                          {trimmed}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
          </SurveySection>
        )}

        {/* Multiple Select */}
        {questionsByType["multiple select question"] && (
          <SurveySection title="Multiple Select Questions">
            {questionsByType["multiple select question"].map((q) => (
              <div key={q.question_id} className="space-y-4 py-2">
                <Label className="text-base font-medium">
                  {q.question_text}
                </Label>
                <div className="space-y-2 mt-2">
                  {q.options.split(",").map((option) => {
                    const trimmed = option.trim();
                    const id = `${q.question_id}-${trimmed}`;
                    const selected = responses[q.question_id]?.split(",") || [];
                    return (
                      <div
                        key={id}
                        className="flex items-center space-x-3 p-2 rounded-md"
                      >
                        <Checkbox
                          id={id}
                          checked={selected.includes(trimmed)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...selected, trimmed]
                              : selected.filter((item) => item !== trimmed);
                            handleResponseChange(
                              q.question_id,
                              updated.join(",")
                            );
                          }}
                          className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                        <Label htmlFor={id} className="cursor-pointer">
                          {trimmed}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </SurveySection>
        )}

        {/* Likert Scale */}
        {questionsByType["likert"] && (
          <SurveySection title="Rating Questions (1–5 Scale)">
            {questionsByType["likert"].map((q) => (
              <div key={q.question_id} className="space-y-4 py-2">
                <Label className="text-base font-medium">
                  {q.question_text}
                </Label>
                <RadioGroup
                  onValueChange={(val) =>
                    handleResponseChange(q.question_id, val)
                  }
                  value={responses[q.question_id]}
                  className="flex justify-between mt-3 px-6"
                >
                  {[1, 2, 3, 4, 5].map((num) => {
                    const id = `${q.question_id}-${num}`;
                    return (
                      <div
                        key={id}
                        className="flex flex-col items-center space-y-1"
                      >
                        <RadioGroupItem
                          value={num.toString()}
                          id={id}
                          className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                        <Label htmlFor={id} className="text-sm">
                          {num}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                <div className="flex justify-between text-sm text-gray-500 px-4 mt-1">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            ))}
          </SurveySection>
        )}

        {/* Handle typo: "llikert" */}
        {questionsByType["llikert"] && (
          <SurveySection title="Additional Rating Questions">
            {questionsByType["llikert"].map((q) => (
              <div key={q.question_id} className="space-y-4 py-2">
                <Label className="text-base font-medium">
                  {q.question_text}
                </Label>
                <Select
                  onValueChange={(val) =>
                    handleResponseChange(q.question_id, val)
                  }
                  value={responses[q.question_id]}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} -{" "}
                        {num === 1 ? "Poor" : num === 5 ? "Excellent" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </SurveySection>
        )}

        {/* Open-Ended - Progressive Display */}
        {questionsByType["open-ended"] &&
          questionsByType["open-ended"].length > 0 && (
            <SurveySection title="Open-Ended Questions">
              {(() => {
                const openEndedQuestions = questionsByType["open-ended"];
                const currentQuestion =
                  openEndedQuestions[currentOpenEndedIndex];

                return (
                  <div
                    key={currentQuestion.question_id}
                    className="space-y-4 py-2"
                  >
                    <Label
                      htmlFor={currentQuestion.question_id}
                      className="text-base font-medium"
                    >
                      {currentQuestion.question_text}
                    </Label>
                    <Textarea
                      id={currentQuestion.question_id}
                      value={responses[currentQuestion.question_id] || ""}
                      onChange={(e) =>
                        handleResponseChange(
                          currentQuestion.question_id,
                          e.target.value
                        )
                      }
                      className="min-h-32 transition-all duration-200"
                      placeholder="Share your thoughts..."
                    />

                    <div className="flex justify-between items-center mt-4">
                      <Button
                        type="button"
                        onClick={() =>
                          setCurrentOpenEndedIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        variant="outline"
                        disabled={currentOpenEndedIndex === 0}
                      >
                        Previous Question
                      </Button>

                      <div className="text-sm text-gray-500">
                        Question {currentOpenEndedIndex + 1} of{" "}
                        {openEndedQuestions.length}
                      </div>

                      <Button
                        type="button"
                        onClick={handleNextOpenEndedQuestion}
                        variant="outline"
                        disabled={
                          currentOpenEndedIndex ===
                          openEndedQuestions.length - 1
                        }
                      >
                        Next Question
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </SurveySection>
          )}

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

const putData = {
  "sessionId": "d61bc05f-9ba6-440e-ab6c-98cf5c95182d",
  "currentStep": "open_ended",
  "score": 15,
  "branch": "cva",
  "responses": {
    "demo_general_1": "Nữ",
    "demo_general_2": "Từ 18 đến 24 tuổi",
    "demo_general_3": "Đại học",

    "pre_general_1": [
      "ae của aespa (CVA)",
      "Hatsune Miku (FVI)",
      "K/DA (FVI)"
    ],
    "pre_general_2": "Cả hai",

    "pre_score_1": 3,
    "pre_score_2": 5,
    "pre_score_3": 2,
    "pre_score_4": 4,
    "pre_score_5": 1,
    "pre_extra_1": "yes",

    "branch_cva_1": 4,
    "branch_cva_2": 5,
    "branch_cva_3": 3,
    "branch_cva_4": 2,
    "branch_cva_5": 4,
    "branch_cva_6": 3,
    "branch_cva_7": 5,
    "branch_cva_8": 4,

    "branch_both_1": 3,
    "branch_both_2": 4,
    "branch_both_3": 5,
    "branch_both_4": 3,
    "branch_both_5": 4,
    "branch_both_6": 5,
    "branch_both_7": 2,
    "branch_both_8": 3,
    "branch_both_9": 4,
    "branch_both_10": 5,
    "branch_both_11": 4,
    "branch_both_12": 3,

    "oe_cva_1": "Cũng cũng",
    "ai_oe_cva_1": "Trong suy nghĩ của bạn, điều gì khiến một Celeb Virtual Avatar trở nên hấp dẫn hoặc dễ tạo thiện cảm hơn? Bạn có thể cho ví dụ cụ thể được không?",
    "extra_oe_cva_1": "Tôi cảm thấy CVA dễ tạo thiện cảm vì họ mang hình ảnh của người nổi tiếng thật mà tôi yêu thích, nên cảm giác rất gần gũi và chân thật.",
    "oe_cva_2": "Tôi thấy bình thường, không có gì đặc biệt."
  }
}

await putN8nWorkflowData(putData)

export default DynamicSurveyForm;
