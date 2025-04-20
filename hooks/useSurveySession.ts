import { useState, useEffect } from "react";
import { postN8nWorkflowData, putN8nWorkflowData } from "@/service/N8NService";
import { SurveySession } from "@/types/survey";

export function useSurveySession() {
  const [session, setSession] = useState<SurveySession | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Tự động khởi tạo session khi mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Gọi POST để tạo session mới ngay khi component mount
        const response = await postN8nWorkflowData({});
        
        const newSession = {
          sessionId: response.session.sessionId,
          currentStep: response.session.currentStep,
          responses: response.session.responses,
          score: response.session.score,
          branch: response.session.branch || null
        };

        // Lưu vào sessionStorage
        sessionStorage.setItem("surveySession", JSON.stringify(newSession));
        
        // Cập nhật state
        setSession(newSession);
        setQuestions(response.questions || []);
      } catch (error) {
        console.error("Khởi tạo session thất bại:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, []); // Chỉ chạy 1 lần khi mount

  // 2. Cập nhật session
  const updateSession = async (updates: Partial<SurveySession>) => {
    if (!session) throw new Error("Session chưa được khởi tạo");

    try {
      const updatedSession = sessionStorage.getItem("surveySession");

      // Gửi PUT request với toàn bộ session
      const response = await putN8nWorkflowData(updatedSession);

      // Cập nhật từ server response
      const serverUpdatedSession = response.session;

      // Lưu vào sessionStorage
      sessionStorage.setItem("surveySession", JSON.stringify(serverUpdatedSession));
      
      // Cập nhật state
      setSession(serverUpdatedSession);
      setQuestions(response.questions || []);

      return serverUpdatedSession;
    } catch (error) {
      console.error("Cập nhật session thất bại:", error);
      throw error;
    }
  };

  return {
    session,
    questions,
    updateSession,
    isLoading: isInitializing,
    error: !session && !isInitializing
  };
}