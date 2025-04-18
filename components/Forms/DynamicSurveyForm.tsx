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

  if (loading) return <div>Loading survey questions...</div>;
  if (error) return <div>{error}</div>;

  const questionsByType = surveyData.reduce((acc, question) => {
    acc[question.type] = acc[question.type] || [];
    acc[question.type].push(question);
    return acc;
  }, {} as Record<string, SurveyQuestion[]>);

  return (
    <form onSubmit={handleSubmit} className="leading-6">
      {/* Single Choice */}
      {questionsByType["single-choice"] && (
        <SurveySection title="Single Choice Questions">
          {questionsByType["single-choice"].map((q) => (
            <div key={q.question_id} className="space-y-2">
              <Label htmlFor={q.question_id}>{q.question_text}</Label>
              <RadioGroup
                onValueChange={(val) =>
                  handleResponseChange(q.question_id, val)
                }
                defaultValue={responses[q.question_id]}
              >
                {q.options.split(",").map((option) => {
                  const trimmed = option.trim();
                  const id = `${q.question_id}-${trimmed}`;
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <RadioGroupItem value={trimmed} id={id} />
                      <Label htmlFor={id}>{trimmed}</Label>
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
            <div key={q.question_id} className="space-y-2">
              <Label>{q.question_text}</Label>
              {q.options.split(",").map((option) => {
                const trimmed = option.trim();
                const id = `${q.question_id}-${trimmed}`;
                const selected = responses[q.question_id]?.split(",") || [];
                return (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={selected.includes(trimmed)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...selected, trimmed]
                          : selected.filter((item) => item !== trimmed);
                        handleResponseChange(q.question_id, updated.join(","));
                      }}
                    />
                    <Label htmlFor={id}>{trimmed}</Label>
                  </div>
                );
              })}
            </div>
          ))}
        </SurveySection>
      )}

      {/* Likert Scale */}
      {questionsByType["likert"] && (
        <SurveySection title="Rating Questions (1–5 Scale)">
          {questionsByType["likert"].map((q) => (
            <div key={q.question_id} className="space-y-2">
              <Label>{q.question_text}</Label>
              <RadioGroup
                onValueChange={(val) =>
                  handleResponseChange(q.question_id, val)
                }
                defaultValue={responses[q.question_id]}
                className="flex justify-between"
              >
                {[1, 2, 3, 4, 5].map((num) => {
                  const id = `${q.question_id}-${num}`;
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <RadioGroupItem value={num.toString()} id={id} />
                      <Label htmlFor={id}>{num}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
        </SurveySection>
      )}

      {/* Open-Ended */}
      {questionsByType["open-ended"] && (
        <SurveySection title="Open-Ended Questions">
          {questionsByType["open-ended"].map((q) => (
            <div key={q.question_id} className="space-y-2">
              <Label htmlFor={q.question_id}>{q.question_text}</Label>
              <Textarea
                id={q.question_id}
                value={responses[q.question_id] || ""}
                onChange={(e) =>
                  handleResponseChange(q.question_id, e.target.value)
                }
              />
            </div>
          ))}
        </SurveySection>
      )}

      {/* Handle typo: "llikert" */}
      {questionsByType["llikert"] && (
        <SurveySection title="Additional Rating Questions">
          {questionsByType["llikert"].map((q) => (
            <div key={q.question_id} className="space-y-2">
              <Label>{q.question_text}</Label>
              <Select
                onValueChange={(val) =>
                  handleResponseChange(q.question_id, val)
                }
                defaultValue={responses[q.question_id]}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </SurveySection>
      )}

      <Button type="submit" className="w-full mt-4">
        Submit Survey
      </Button>
    </form>
  );
}

const SurveySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">{children}</CardContent>
  </Card>
);

export default DynamicSurveyForm;
