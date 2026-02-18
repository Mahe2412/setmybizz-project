import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { BusinessData } from '../types';

/**
 * Saves or updates a business profile for a user.
 * @param userId - The Firebase Auth User ID
 * @param data - The business data collected during onboarding
 */
export const saveBusinessProfile = async (userId: string, data: BusinessData) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        const businessData = {
            ...data,
            lastUpdated: serverTimestamp(),
        };

        if (userSnap.exists()) {
            await updateDoc(userRef, {
                businessProfile: businessData,
                profileCompleted: true
            });
        } else {
            await setDoc(userRef, {
                uid: userId,
                email: data.name ? `${data.name.replace(/\s+/g, '.').toLowerCase()}@placeholder.com` : '', // Fallback if no email provided in BusinessData yet
                businessProfile: businessData,
                createdAt: serverTimestamp(),
                profileCompleted: true
            });
        }

        console.log("Business Profile Saved Successfully!");
        return true;
    } catch (error) {
        console.error("Error saving business profile:", error);
        throw error;
    }
};
