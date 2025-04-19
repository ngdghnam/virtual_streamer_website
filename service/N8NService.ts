// service/N8NService.ts
import axios from "axios";

export const getN8nWorkflowData = async () => {
  try {
    const response = await axios.get(
      "https://fsedegrayhnam.app.n8n.cloud/webhook/dynamic-survey"
    );
    console.log("Workflow data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching workflow data:", error);
    throw error;
  }
};

export const PostN8nWorkflowData = async (data) => {
  try {
    const response = await axios.post(
      "https://fsedegrayhnam.app.n8n.cloud/webhook-test/dynamic-survey",
      data
    );
    console.log("Data successfully submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting survey data:", error);
    throw error;
  }
};

export const putN8nWorkflowData = async (data) => {
  try {
    const response = await axios.put(
      "https://fsedegrayhnam.app.n8n.cloud/webhook/dynamic-survey",
      data
    );
    console.log("Data successfully updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating workflow data:", error);
    throw error;
  }
};
