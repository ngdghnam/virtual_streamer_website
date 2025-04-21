import Navbar from "@/components/Navbar";
import DescriptionSection from "@/components/Sections/DescriptionSection";
import DynamicSurveySection from "@/components/Sections/DynamicSurveySection";
import EndSection from "@/components/Sections/EndSection";
import { SurveyProvider } from "@/contexts/SurveyContext";

export default function Home() {
  return (
    <SurveyProvider>
      <div className="relative z-50 flex flex-col px-4">
        <Navbar />
        <DescriptionSection />
        <DynamicSurveySection />
        <EndSection />
      </div>
    </SurveyProvider>
  );
}
