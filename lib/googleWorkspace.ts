import { google } from "googleapis";
import { prisma } from "@billease/db";
import { isDevAuthBypass } from "./devAuth";

// OAuth2 Client setup helper
export async function getGoogleOAuthClient(businessId: string = "seed-business") {
  // Try to find Google integration credentials from DB
  const integration = await prisma.crmIntegration.findFirst({
    where: { businessId, type: "google" }
  });

  if (!integration || !integration.active || !integration.credentials) {
    return null;
  }

  try {
    const creds = JSON.parse(integration.credentials);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || creds.clientId,
      process.env.GOOGLE_CLIENT_SECRET || creds.clientSecret,
      creds.redirectUri || `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/callback/google`
    );

    oauth2Client.setCredentials({
      access_token: creds.accessToken,
      refresh_token: creds.refreshToken,
      expiry_date: creds.expiryDate
    });

    return oauth2Client;
  } catch (error) {
    console.error("Failed to parse or initialize Google OAuth client:", error);
    return null;
  }
}

// 1. Send Gmail
export async function sendGmail({
  to,
  subject,
  body,
  businessId = "seed-business"
}: {
  to: string;
  subject: string;
  body: string;
  businessId?: string;
}) {
  const client = await getGoogleOAuthClient(businessId);
  
  if (!client || isDevAuthBypass()) {
    console.log(`[Google Sync Simulation] Send Gmail to ${to}: "${subject}"`);
    return {
      success: true,
      simulated: true,
      messageId: `sim-msg-${Date.now()}`,
      to,
      subject
    };
  }

  try {
    const gmail = google.gmail({ version: "v1", auth: client });
    
    // Construct MIME message
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      body
    ];
    const message = messageParts.join("\n");
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage
      }
    });

    return { success: true, messageId: res.data.id };
  } catch (error: any) {
    console.error("Gmail send error:", error);
    throw new Error(error.message || "Failed to send email via Google Workspace");
  }
}

// 2. Create Google Doc (Drive API)
export async function createGoogleDoc({
  title,
  content,
  businessId = "seed-business"
}: {
  title: string;
  content: string;
  businessId?: string;
}) {
  const client = await getGoogleOAuthClient(businessId);

  if (!client || isDevAuthBypass()) {
    console.log(`[Google Sync Simulation] Create Doc: "${title}"`);
    return {
      success: true,
      simulated: true,
      fileId: `sim-doc-${Date.now()}`,
      webViewLink: `https://docs.google.com/document/d/simulated-id-${Date.now()}/edit`
    };
  }

  try {
    const drive = google.drive({ version: "v3", auth: client });
    const docs = google.docs({ version: "v1", auth: client });

    // Create a new blank document in Google Docs
    const docRes = await docs.documents.create({
      requestBody: { title }
    });

    const documentId = docRes.data.documentId;
    if (!documentId) throw new Error("Failed to retrieve document ID");

    // Insert content into the document
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content
            }
          }
        ]
      }
    });

    // Get web link from Drive metadata
    const driveRes = await drive.files.get({
      fileId: documentId,
      fields: "webViewLink"
    });

    return { success: true, fileId: documentId, webViewLink: driveRes.data.webViewLink };
  } catch (error: any) {
    console.error("Google Docs creation error:", error);
    throw new Error(error.message || "Failed to create Google Doc");
  }
}

// 3. Create Google Sheet (Drive/Sheets API)
export async function createGoogleSheet({
  title,
  headers,
  rows,
  businessId = "seed-business"
}: {
  title: string;
  headers: string[];
  rows: any[][];
  businessId?: string;
}) {
  const client = await getGoogleOAuthClient(businessId);

  if (!client || isDevAuthBypass()) {
    console.log(`[Google Sync Simulation] Create Sheet: "${title}"`);
    return {
      success: true,
      simulated: true,
      spreadsheetId: `sim-sheet-${Date.now()}`,
      webViewLink: `https://docs.google.com/spreadsheets/d/simulated-id-${Date.now()}/edit`
    };
  }

  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    
    // Create new spreadsheet
    const sheetRes = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title }
      }
    });

    const spreadsheetId = sheetRes.data.spreadsheetId;
    if (!spreadsheetId) throw new Error("Failed to retrieve spreadsheet ID");

    // Add headers and rows
    const values = [headers, ...rows];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values }
    });

    return {
      success: true,
      spreadsheetId,
      webViewLink: sheetRes.data.spreadsheetUrl
    };
  } catch (error: any) {
    console.error("Google Sheets creation error:", error);
    throw new Error(error.message || "Failed to create Google Sheet");
  }
}

// 4. Create Google Calendar Event
export async function createCalendarEvent({
  summary,
  startTime,
  endTime,
  description = "",
  businessId = "seed-business"
}: {
  summary: string;
  startTime: string;
  endTime: string;
  description?: string;
  businessId?: string;
}) {
  const client = await getGoogleOAuthClient(businessId);

  if (!client || isDevAuthBypass()) {
    console.log(`[Google Sync Simulation] Create Event: "${summary}" from ${startTime} to ${endTime}`);
    return {
      success: true,
      simulated: true,
      eventId: `sim-event-${Date.now()}`,
      htmlLink: "https://calendar.google.com/calendar/r/eventedit"
    };
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: client });
    const eventRes = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: "Asia/Kolkata"
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
          timeZone: "Asia/Kolkata"
        }
      }
    });

    return {
      success: true,
      eventId: eventRes.data.id,
      htmlLink: eventRes.data.htmlLink
    };
  } catch (error: any) {
    console.error("Google Calendar insertion error:", error);
    throw new Error(error.message || "Failed to schedule Calendar Event");
  }
}
