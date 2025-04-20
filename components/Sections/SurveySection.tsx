import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { putN8nWorkflowData } from "@/service/N8NService";

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
    <CardContent className="space-y-6 pt-6">{children}
      
    </CardContent>
    
  </Card>
);


export default SurveySection;
