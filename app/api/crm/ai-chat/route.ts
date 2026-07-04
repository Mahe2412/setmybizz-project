import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { prisma } from "@billease/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/billease/session";
import { sendGmail, createGoogleDoc, createGoogleSheet, createCalendarEvent } from "@/lib/googleWorkspace";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const session = await getSession();
    const businessId = session?.user?.businessId || "seed-business";

    const body = await req.json();
    const { systemPrompt, userMessage, leadId } = body;

    if (!userMessage) {
      return NextResponse.json({ error: "User message is required" }, { status: 400 });
    }

    // Initialize Gemini model with tools
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt || "You are Arkle CRM, the neural sales assistant of BizOS.",
      tools: [
        {
          functionDeclarations: [
            {
              name: "get_product_catalog",
              description: "Retrieves the business product/services catalog containing prices and descriptions.",
            },
            {
              name: "create_draft_invoice",
              description: "Creates a draft invoice in BillBook for the customer.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  itemName: { type: SchemaType.STRING, description: "Name of the service (e.g. Pvt Ltd Incorporation, GST Registration)" },
                  price: { type: SchemaType.NUMBER, description: "The price of the service" }
                },
                required: ["itemName", "price"]
              }
            },
            {
              name: "get_financial_summary",
              description: "Gets the total outstanding payments or financial records overview of the customer/lead."
            },
            {
              name: "send_email",
              description: "Sends an email to a lead or customer using Gmail.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  to: { type: SchemaType.STRING, description: "The recipient's email address" },
                  subject: { type: SchemaType.STRING, description: "The subject line of the email" },
                  body: { type: SchemaType.STRING, description: "The email content/body (HTML allowed)" }
                },
                required: ["to", "subject", "body"]
              }
            },
            {
              name: "create_google_doc",
              description: "Creates a document in Google Drive/Docs.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING, description: "Title of the document" },
                  content: { type: SchemaType.STRING, description: "Content of the document" }
                },
                required: ["title", "content"]
              }
            },
            {
              name: "create_google_sheet",
              description: "Creates a spreadsheet in Google Drive/Sheets.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING, description: "Title of the spreadsheet" },
                  headers: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Column headers for the spreadsheet"
                  },
                  rows: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING }
                    },
                    description: "Rows of data to populate under the headers"
                  }
                },
                required: ["title", "headers", "rows"]
              }
            },
            {
              name: "create_calendar_event",
              description: "Schedules a Google Calendar meeting or event.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  summary: { type: SchemaType.STRING, description: "Title/summary of the meeting/event" },
                  startTime: { type: SchemaType.STRING, description: "ISO 8601 start time (e.g. 2026-06-25T15:00:00+05:30)" },
                  endTime: { type: SchemaType.STRING, description: "ISO 8601 end time (e.g. 2026-06-25T16:00:00+05:30)" },
                  description: { type: SchemaType.STRING, description: "Details of the event" }
                },
                required: ["summary", "startTime", "endTime"]
              }
            }
          ]
        }
      ]
    });

    // Start a chat session to handle tool roundtrip
    const chat = model.startChat();
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;

    // Check for function calls
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let functionResult = {};

      console.log(`Arkle CRM Tool Execution: ${call.name}`, call.args);

      if (call.name === "get_product_catalog") {
        const items = await prisma.item.findMany({
          orderBy: { name: "asc" }
        });
        
        if (items.length === 0) {
          functionResult = {
            products: [
              { name: "Pvt Ltd Incorporation", price: 5999, description: "Digital company setup with DSC, DIN, SPICe+ filing" },
              { name: "GST Registration", price: 1499, description: "GSTIN certificate application with tracking" },
              { name: "Trademark Registration", price: 1999, description: "Brand name protection search and filing" },
              { name: "Annual Compliance Pack", price: 1999, description: "CA support for MCA filings and balance sheets" }
            ]
          };
        } else {
          functionResult = {
            products: items.map(i => ({ name: i.name, price: i.salePrice, description: i.description }))
          };
        }
      } else if (call.name === "create_draft_invoice" && leadId) {
        const { itemName, price } = call.args as { itemName: string; price: number };
        const lead = await prisma.crmLead.findUnique({ where: { id: leadId } });

        if (lead) {
          const doc = await prisma.document.create({
            data: {
              businessId,
              type: "invoice",
              status: "draft",
              placeOfSupply: "27",
              grandTotal: price,
              subtotal: price,
              taxableTotal: price,
              notes: `Auto-generated by Arkle CRM Agent for ${lead.name}`,
              lines: {
                create: {
                  description: itemName,
                  rate: price,
                  qty: 1,
                  lineTotal: price
                }
              }
            }
          });

          await prisma.crmMessage.create({
            data: {
              leadId,
              role: "ai",
              text: `⚙️ [Arkle OS Integration] Draft invoice for "${itemName}" (₹${price.toLocaleString()}) has been created in BillBook (Invoice ID: ${doc.id.substring(0,8)}).`,
            }
          });

          functionResult = {
            success: true,
            invoiceId: doc.id,
            total: price,
            message: `Draft invoice successfully created in BillBook. Sent system notification to user.`
          };
        } else {
          functionResult = { success: false, error: "Lead context not found" };
        }
      } else if (call.name === "get_financial_summary") {
        const totalOutstanding = await prisma.document.aggregate({
          where: { status: "unpaid" },
          _sum: { grandTotal: true }
        });
        functionResult = {
          outstandingAmount: totalOutstanding._sum.grandTotal || 0,
          currency: "INR"
        };
      } else if (call.name === "send_email") {
        const { to, subject, body } = call.args as { to: string; subject: string; body: string };
        const res = await sendGmail({ to, subject, body, businessId });
        
        if (leadId) {
          await prisma.crmMessage.create({
            data: {
              leadId,
              role: "ai",
              text: `✉️ [Gmail Sync] Sent email to ${to}: "${subject}"`,
            }
          });
        }
        functionResult = res;

      } else if (call.name === "create_google_doc") {
        const { title, content } = call.args as { title: string; content: string };
        const res = await createGoogleDoc({ title, content, businessId });
        
        if (leadId) {
          await prisma.crmMessage.create({
            data: {
              leadId,
              role: "ai",
              text: `📄 [Drive Sync] Created Google Doc "${title}". Link: ${res.webViewLink}`,
            }
          });
        }
        functionResult = res;

      } else if (call.name === "create_google_sheet") {
        const { title, headers, rows } = call.args as { title: string; headers: string[]; rows: any[][] };
        const res = await createGoogleSheet({ title, headers, rows, businessId });
        
        if (leadId) {
          await prisma.crmMessage.create({
            data: {
              leadId,
              role: "ai",
              text: `📊 [Drive Sync] Created Google Sheet "${title}". Link: ${res.webViewLink}`,
            }
          });
        }
        functionResult = res;

      } else if (call.name === "create_calendar_event") {
        const { summary, startTime, endTime, description } = call.args as { summary: string; startTime: string; endTime: string; description?: string };
        const res = await createCalendarEvent({ summary, startTime, endTime, description, businessId });
        
        if (leadId) {
          await prisma.crmMessage.create({
            data: {
              leadId,
              role: "ai",
              text: `📅 [Calendar Sync] Scheduled Event "${summary}" on ${new Date(startTime).toLocaleString()}`,
            }
          });
        }
        functionResult = res;
      }

      // Send the tool results back to Gemini to generate the final text reply
      const finalResult = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: functionResult
          }
        }
      ]);
      const finalResponse = await finalResult.response;
      return NextResponse.json({ reply: finalResponse.text().trim() });
    }

    return NextResponse.json({ reply: response.text().trim() });
  } catch (error: any) {
    console.error("Gemini CRM Chat Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI response" }, { status: 500 });
  }
}
