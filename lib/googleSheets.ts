import { google } from 'googleapis';

// Environment variables should be used for these
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1_vzF_T_uExFxamiW9OCGTAMxIEzbdwJyBaKJ1VIwDCE';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Appends a row of data to the Google Sheet.
 * @param data Array of strings/numbers to append as a row
 * @returns boolean indicating success
 */
export const appendToSheet = async (data: any[]) => {
    try {
        const client_email = process.env.GOOGLE_CLIENT_EMAIL;
        // Handle private key newlines for Vercel/various env handlers
        const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!client_email || !private_key) {
            console.warn('[Google Sheets] Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY. Skipping sync.');
            return false;
        }

        const auth = new google.auth.JWT({
            email: client_email,
            key: private_key,
            scopes: SCOPES
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Leads!A:H', // Assumes a 'Leads' tab exists. Make sure to create it.
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [data]
            }
        });

        console.log('[Google Sheets] Successfully appended row.');
        return true;
    } catch (error: any) {
        console.error('[Google Sheets] Error appending row:', error?.message || error);
        return false;
    }
};

/**
 * Reads leads from the Google Sheet (Admin use only)
 */
export const fetchSheetLeads = async () => {
    try {
        const client_email = process.env.GOOGLE_CLIENT_EMAIL;
        const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!client_email || !private_key) return [];

        const auth = new google.auth.JWT({
            email: client_email,
            key: private_key,
            scopes: SCOPES
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Leads!A2:H', // Skip header
        });

        return response.data.values || [];
    } catch (error) {
        console.error('[Google Sheets] Error fetching leads:', error);
        return [];
    }
};
