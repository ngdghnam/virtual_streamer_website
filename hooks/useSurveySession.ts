/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { postN8nWorkflowData, putN8nWorkflowData } from "@/service/N8NService";
import { SurveySession } from "@/types/survey";

export function useSurveySession() {
  const [session, setSession] = useState<SurveySession | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          branch: response.session.branch || null,
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
  const updateSession = async () => {
    if (!session) throw new Error("Session chưa được khởi tạo");

    try {
      const raw = sessionStorage.getItem("surveySession");
      if (!raw)
        throw new Error("Không tìm thấy dữ liệu session trong sessionStorage");

      let parsedSession;
      try {
        parsedSession = JSON.parse(raw);
      } catch (parseErr) {
        throw new Error("Dữ liệu session trong sessionStorage bị lỗi JSON");
      }

      if (!parsedSession.sessionId) {
        throw new Error("Session không hợp lệ: thiếu sessionId");
      }

      // Gửi PUT request với session hợp lệ
      const response = await putN8nWorkflowData(parsedSession);

      const serverUpdatedSession = response?.session;
      if (!serverUpdatedSession || !serverUpdatedSession.sessionId) {
        throw new Error("Phản hồi từ server không chứa session hợp lệ");
      }

      // Lưu session mới vào sessionStorage
      sessionStorage.setItem(
        "surveySession",
        JSON.stringify(serverUpdatedSession)
      );

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
    error: !session && !isInitializing,
  };
}
