import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SurveySection from "@/components/Sections/SurveySection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BranchDetailsStepProps } from "@/interfaces/iBranchDetailsStepProps";

const BranchDetailsStep: React.FC<BranchDetailsStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  onNextStep,
}) => {
  const branchQuestion = (questionsByType["likert"] || []).filter(
    (q) => q.group === "branch_details"
  );
  // Combine all relevant questions
  const allQuestions = [
    ...(questionsByType["likert"] || [])
    ]

  // Check if all are answered
  const areAllQuestionsAnswered = allQuestions.every((q) => {
    const res = responses[q.question_id];
    return res !== undefined && res !== null && res.trim() !== "";
  });

  return (
    <>
      {/* Handle Likert scale questions */}
      {branchQuestion.length > 0 && (
        <SurveySection title="Branch Details">
          {branchQuestion.map((q) => (
            <div key={q.question_id} className="space-y-4 py-2">
              <Label className="text-base font-medium">{q.question_text}</Label>
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

          {/* Next Button */}
          {onNextStep && (
            <div className="pt-4">
              <Button
                type="button"
                onClick={onNextStep}
                disabled={!areAllQuestionsAnswered}
              >
                Next
              </Button>
            </div>
          )}
        </SurveySection>
      )}
    </>
  );
};

export default BranchDetailsStep;
