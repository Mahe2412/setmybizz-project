import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { appendToSheet } from '@/lib/googleSheets';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, businessName, nature, source = 'api' } = body;

        // 1. Validation
        if (!phone && !email) {
            return NextResponse.json({ error: "Email or Phone is required" }, { status: 400 });
        }

        // 2. AI Analysis (Optional)
        let aiSummary = "";
        if (nature && process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Analyze this business nature: '${nature}'. Provide a 1-sentence expert recommendation for incorporation structure (Pvt Ltd, LLP, or Proprietorship).`;
                const result = await model.generateContent(prompt);
                aiSummary = result.response.text();
            } catch (e) {
                console.error("AI Error:", e);
            }
        }

        // 3. Save to Firestore
        const leadData = {
            name: name || 'Guest',
            email: email || '',
            phone: phone || '',
            businessData: {
                name: businessName || '',
                industry: nature || '',
            },
            aiSummary,
            source,
            createdAt: serverTimestamp(),
            status: 'new',
            interestScore: 10,
            metadata: body.metadata || {},
        };

        const docRef = await addDoc(collection(db, "leads"), leadData);

        // 4. Sync to Google Sheets
        // Format: [Date, Lead ID, Name, Phone, Email, Business Name, Industry, Status, AI Summary]
        const sheetRow = [
            new Date().toISOString(),
            docRef.id,
            name || 'Guest',
            phone || '',
            email || '',
            businessName || '',
            nature || '',
            'New',
            aiSummary
        ];
        
        await appendToSheet(sheetRow);

        return NextResponse.json({ 
            success: true, 
            id: docRef.id, 
            aiSummary,
            message: "Lead created and synced." 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Lead API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Basic Admin Protection (Check for specific header or query param)
    // TODO: Integrate with Auth Middleware later
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.ADMIN_SECRET_KEY && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const leads = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ leads });
    } catch (error: any) {
        console.error("Fetch Leads Error:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
