// components/DynamicSurveyForm.tsx
"use client";

import { useEffect, useState } from "react";
import { getN8nWorkflowData } from "@/service/N8NService";
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

function DynamicSurveyForm() {
  const [surveyData, setSurveyData] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Survey responses:", responses);
    // Send responses to backend here
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

                    {responses[currentQuestion.question_id]?.trim() &&
                      currentOpenEndedIndex < openEndedQuestions.length - 1 && (
                        <Button
                          type="button"
                          onClick={handleNextOpenEndedQuestion}
                          variant="outline"
                          className="mt-2"
                        >
                          Next Question
                        </Button>
                      )}

                    <div className="text-sm text-gray-500 mt-2">
                      Question {currentOpenEndedIndex + 1} of{" "}
                      {openEndedQuestions.length}
                    </div>
                  </div>
                );
              })()}
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

        <Button type="submit" className="w-full py-6 text-lg font-medium mt-8">
          Submit Survey
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
