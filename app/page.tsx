"use client";
import Navbar from "@/components/Navbar";
import DescriptionSection from "@/components/Sections/DescriptionSection";
import DynamicSurveySection from "@/components/Sections/DynamicSurveySection";
import EndSection from "@/components/Sections/EndSection";

export default function Home() {
  return (
    <div className="relative z-50 flex flex-col px-4">
      <Navbar></Navbar>
      <DescriptionSection></DescriptionSection>
      <DynamicSurveySection></DynamicSurveySection>
      <EndSection></EndSection>
    </div>
  );
}
