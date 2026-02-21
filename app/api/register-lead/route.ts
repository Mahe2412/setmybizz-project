import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, businessName, nature } = body;

        // 1. Generate AI Insight
        let aiSummary = "Insight pending...";
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                // Initialize Gemini client
                const genAI = new GoogleGenerativeAI(apiKey);
                // Use gemini-1.5-flash for faster response times (low latency).
                // Note: Gemini 3.5 does not exist; 1.5 is the current generation.
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
