import React from "react";
import DynamicSurveyForm from "../Forms/DynamicSurveyForm";

const DynamicSurveySection = () => {
  return (
    <div className="mt-6 p-4 rounded-lg mx-1">
      <h1 className="font-medium text-2xl mb-3">Dynamic Survey Questions</h1>
      <DynamicSurveyForm></DynamicSurveyForm>
    </div>
  );
};

export default DynamicSurveySection;
