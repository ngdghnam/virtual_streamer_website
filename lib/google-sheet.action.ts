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
