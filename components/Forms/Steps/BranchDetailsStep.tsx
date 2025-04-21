import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import SurveySection from "@/components/Sections/SurveySection";
import { BranchDetailsStepProps } from "@/interfaces/iBranchDetailsStepProps";

const LIKERT_SCALE = [1, 2, 3, 4, 5] as const;

const BranchDetailsStep: React.FC<BranchDetailsStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  onNextStep,
}) => {
  const branchQuestion = (questionsByType["likert"] || []).filter(
    (q) => q.group === "branch_details"
  );

  const createSafeKey = (questionId: string, value: string | number): string =>
    `${questionId}-${encodeURIComponent(String(value))}`;

  // Check if all are answered
  const areAllQuestionsAnswered = branchQuestion.every((q) => {
    const res = responses[q.question_id];
    return res !== undefined && res !== null && res.trim() !== "";
  });

  if (branchQuestion.length === 0) return null;

  return (
    <SurveySection title="Branch Details">
      {branchQuestion.map((q) => (
        <div key={q.question_id} className="space-y-4 py-2">
          <Label className="text-base font-medium">{q.question_text}</Label>
          <RadioGroup
            onValueChange={(val) => handleResponseChange(q.question_id, val)}
            value={responses[q.question_id]}
            className="flex justify-between mt-3 px-6"
          >
            {LIKERT_SCALE.map((num) => {
              const id = createSafeKey(q.question_id, num);
              return (
                <div key={id} className="flex flex-col items-center space-y-1">
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
            <span>Hoàn toàn không đồng ý</span>
            <span>Hoàn toàn đồng ý</span>
          </div>
        </div>
      ))}

      {onNextStep && (
        <div className="pt-4">
          <Button
            type="button"
            className="cursor-pointer"
            onClick={onNextStep}
            disabled={!areAllQuestionsAnswered}
          >
            Tiếp tục
          </Button>
        </div>
      )}
    </SurveySection>
  );
};

export default BranchDetailsStep;
