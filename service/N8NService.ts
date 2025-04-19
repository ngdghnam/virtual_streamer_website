// service/N8NService.ts
import axios from "axios";

// Base URLs — split prod & test if needed
const BASE_URL = "https://havyluu.app.n8n.cloud/webhook/dynamic-survey";
const TEST_URL = "https://fsedegrayhnam.app.n8n.cloud/webhook-test/dynamic-survey";

// Helper for logging errors with more clarity
const logError = (label: string, error: any) => {
  console.error(`${label}:`, error?.response?.data || error.message || error);
};

export const getN8nWorkflowData = async () => {
  try {
    const response = await axios.get(BASE_URL);
    console.log("Workflow data received:", response.data);
    return response.data;
  } catch (error) {
    logError("Error fetching workflow data", error);
    throw error;
  }
};

export const postN8nWorkflowData = async (data: any) => {
  try {
    const response = await axios.post(
      "https://fsedegrayhnam.app.n8n.cloud/webhook-test/dynamic-survey",
      data
    );
    console.log("Data successfully submitted:", response.data);
    return response.data;
  } catch (error) {
    logError("Error submitting survey data", error);
    throw error;
  }
};

export const putN8nWorkflowData = async (data: any) => {
  try {
    const response = await axios.put(BASE_URL, data);
    console.log("Data successfully updated & question received:", response.data);
    return response.data;
  } catch (error) {
    logError("Error updating workflow data", error);
    throw error;
  }
};
