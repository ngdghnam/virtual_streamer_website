import { useState, useEffect } from "react";
import { getN8nWorkflowData } from "@/service/N8NService";

export function useSurveyData() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { surveyData, loading, error };
}
