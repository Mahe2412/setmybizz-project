import { NextResponse } from "next/server";
import { getSession } from "@/lib/billease/session";
import { sendGmail, createGoogleDoc, createGoogleSheet, createCalendarEvent } from "@/lib/googleWorkspace";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || "seed-business";

    const body = await req.json();
    const { action, payload } = body;

    if (!action || !payload) {
      return NextResponse.json({ error: "Missing action or payload" }, { status: 400 });
    }

    let result;

    switch (action) {
      case "SEND_EMAIL":
        result = await sendGmail({
          to: payload.to,
          subject: payload.subject,
          body: payload.body,
          businessId
        });
        break;

      case "CREATE_GOOGLE_DOC":
        result = await createGoogleDoc({
          title: payload.title,
          content: payload.content,
          businessId
        });
        break;

      case "CREATE_GOOGLE_SHEET":
        result = await createGoogleSheet({
          title: payload.title,
          headers: payload.headers,
          rows: payload.rows,
          businessId
        });
        break;

      case "CREATE_CALENDAR_EVENT":
        result = await createCalendarEvent({
          summary: payload.summary,
          startTime: payload.startTime,
          endTime: payload.endTime,
          description: payload.description,
          businessId
        });
        break;

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error(`Google Integration API Error:`, error);
    return NextResponse.json({ error: error.message || "Execution failed" }, { status: 500 });
  }
}
