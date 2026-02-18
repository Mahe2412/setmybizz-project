import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with a placeholder if not present, but warn.
// User must provide GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, businessName, nature } = body;

        // 1. Generate AI Insight
        let aiSummary = "Insight pending...";
        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Analyze this business nature: '${nature}'. Provide a 2-line expert recommendation starting with 'Expert Recommendation:'. Do not include markdown formatting like asterisks.`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiSummary = response.text();
            } catch (error) {
                console.error("Gemini AI Error:", error);
                aiSummary = "AI Analysis unavailable currently.";
            }
        } else {
            aiSummary = "AI Analysis pending (Missing API Key)";
        }

        // 2. Save to Firestore (Server-side)
        // Note: We need to use the admin SDK or client SDK initialized on server. 
        // Since we initialized `db` in `lib/firebase` using client SDK, it works in Next.js API routes 
        // IF the config allows. For strictly server-side, Admin SDK is better, 
        // but we'll stick to the initialized instance for simplicity if it works, 
        // otherwise we might need a separate server init.
        // However, `firebase/firestore` is the Web SDK. It might complain in Node environment 
        // without some polyfills or strictly node-compatible auth.
        // For this prototype, we'll assume it works or fall back to client submission if needed.
        // Actually, `firebase` package works in Node.js environments too for basic operations.

        /* 
           IMPORTANT: The standard Web SDK (`firebase/firestore`) relies on Browser APIs (indexedDB, etc) 
           which might not exist in Node/Edge.
           For a robust backend route, `firebase-admin` is preferred.
           But let's try to proceed with the existing `db` from `@/lib/firebase`.
        */

        // We will verify this works. If not, we might revert to client-side logic for the 'db' write
        // but call this API for the 'AI' part.
        // Actually, let's keep it simple: Client calls API, API does AI, returns Insight, Client writes to DB.
        // OR: Client writes to DB, Cloud Function triggers AI. 
        // User asked for "API Route for lead creation". So we must try to write here.

        // Let's use the standard `addDoc` here. If it fails due to env, we'll fix.

        // BUT wait, `lib/firebase.ts` initializes analytics with `window` check. 
        // The `getFirestore(app)` should work in Node if not using offline persistence.

        const docRef = await addDoc(collection(db, "leads"), {
            name,
            email,
            phone,
            businessName,
            nature,
            aiSummary,
            createdAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true, id: docRef.id, aiSummary }, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to register lead" }, { status: 500 });
    }
}
