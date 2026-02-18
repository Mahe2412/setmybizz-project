export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    nature: string;
    createdAt: any; // Firestore Timestamp
    aiSummary?: string; // The AI recommendation
}
