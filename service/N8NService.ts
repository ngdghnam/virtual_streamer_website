// service/N8NService.ts
import axios from "axios";

// Base URLs — split prod & test if needed
const BASE_URL = "https://havyluu.app.n8n.cloud/webhook/dynamic-survey";

// Helper for logging errors with more clarity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logError = (label: string, error: any) => {
  console.error(`${label}:`, error?.response?.data || error.message || error);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postN8nWorkflowData = async (data: any) => {
  try {
    const response = await axios.post(BASE_URL, data);
    console.log("Data successfully submitted:", response.data);
    return response.data;
  } catch (error) {
    logError("Error submitting survey data", error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putN8nWorkflowData = async (data: any) => {
  try {
    const response = await axios.put(BASE_URL, data);
    console.log(
      "Data successfully updated & question received:",
      response.data
    );
    return response.data;
  } catch (error) {
    logError("Error updating workflow data", error);
    throw error;
  }
};
