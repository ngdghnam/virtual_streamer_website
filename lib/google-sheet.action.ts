"use server";
import { google } from "googleapis";

export async function getSheetData() {
  try {
    const glAuth = await google.auth.getClient({
      projectId: process.env.PROJECT_ID,
      credentials: {
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.CLIENT_EMAIL,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const data = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "questions", // Replace with your actual sheet name or range
    });

    const rows = data.data.values;

    if (!rows || rows.length === 0) {
      throw new Error("No data found in the sheet.");
    }

    // Transform array to object
    const [headers, ...entries] = rows;
    const transformedData = entries.map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {} as Record<string, string>)
    );

    console.log("Transformed data:", transformedData);

    return { data: transformedData };
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function addSheetData(values: string[][]) {
  try {
    const glAuth = await google.auth.getClient({
      projectId: process.env.PROJECT_ID,
      credentials: {
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.CLIENT_EMAIL,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const response = await glSheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "random_giveaways", // Make sure this matches your sheet name
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    // console.log("Data added successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Test function to check basic access
export async function testSheetsAccess() {
  try {
    const glAuth = await google.auth.getClient({
      projectId: process.env.PROJECT_ID,
      credentials: {
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.CLIENT_EMAIL,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    // Just try to get spreadsheet metadata first
    const response = await glSheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });

    console.log(
      "Connection successful! Spreadsheet title:",
      response.data.properties?.title
    );
    return { success: true, title: response.data.properties?.title };
  } catch (error) {
    console.error("Test connection failed:", error);
    return { success: false, error };
  }
}
