import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Lead } from '../types';

/**
 * Lead Engine: Handles lead capture, unique ID generation, and syncing.
 */

// 1. Generate Unique Lead ID (SMB-YYYY-XXXX)
export const generateLeadId = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const prefix = `SMB-${year}`;
    
    // We ideally should use a transaction or counter, but for simplicity:
    // Generate a secure random number plus part of timestamp
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit
    const timestampPart = Date.now().toString().slice(-4);
    
    return `${prefix}-${timestampPart}-${randomSuffix}`;
};

// 2. Identify or Create Lead from Guest Session
export const identifyLead = async (guestId: string, userId?: string): Promise<string> => {
    // Check if lead exists for this guestId
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('guestId', '==', guestId), orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        // Return existing lead ID
        const lead = snapshot.docs[0].data() as Lead;
        // If user just logged in, link the lead
        if (userId && !lead.uid) {
            await updateDoc(doc(db, 'leads', lead.leadId), { uid: userId });
        }
        return lead.leadId;
    }

    // Create New Lead
    const newLeadId = await generateLeadId();
    const newLead: Partial<Lead> = {
        leadId: newLeadId,
        guestId,
        uid: userId || undefined,
        status: 'new',
        interestScore: 10, // Initial score for visit
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        source: 'direct_website',
        businessData: {} as any // Empty initially
    };

    await setDoc(doc(db, 'leads', newLeadId), newLead);
    return newLeadId;
};

// 3. Sync Lead Data (Debounced or Event-based)
export const syncLeadData = async (leadId: string, data: Partial<Lead['businessData']>) => {
    if (!leadId) return;
    
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, {
            businessData: data, 
            lastActiveAt: serverTimestamp()
        });
        
        // Also update interest score based on data completeness
        const score = calculateInterestScore(data);
        if (score > 0) {
             await updateDoc(leadRef, { interestScore: score });
        }

    } catch (e) {
        console.error("Error syncing lead data", e);
    }
};

const calculateInterestScore = (data: any): number => {
    let score = 10;
    if (data.name) score += 10;
    if (data.industry) score += 10;
    if (data.stage) score += 10;
    if (data.contact?.phone) score += 50; // High value
    return score;
};

// 4. Capture User Action (Click, Hover)
export const logUserAction = async (leadId: string, action: string, details?: any) => {
    if (!leadId) return;
    const logsRef = collection(db, 'leads', leadId, 'activity_logs');
    await addDoc(logsRef, {
        action,
        details,
        timestamp: serverTimestamp()
    });
};
