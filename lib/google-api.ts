// src/lib/google-api.ts
// This file will handle all real communications with Google APIs
// once we have the Client ID and Secret from Google Cloud Console.

export interface GoogleEmail {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
    isUnread: boolean;
}

export interface GoogleCalendarEvent {
    id: string;
    title: string;
    startTime: string; // ISO string
    endTime: string;
    meetLink?: string;
    colorId?: string;
}

export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
}

// Google API Client for SetMyBizz

// Types
export interface GoogleEmail {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
    isUnread: boolean;
}

export interface GoogleCalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    meetLink?: string;
    colorId?: string;
}

export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
    webViewLink?: string;
    iconLink?: string;
}

// REAL API CALLS
// Note: These require a valid Google Access Token with appropriate scopes

export const fetchUserEmails = async (accessToken: string): Promise<GoogleEmail[]> => {
    try {
        // 1. List messages
        const listResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = await listResponse.json();
        if (!listData.messages) return [];

        // 2. Fetch details for each message (Promise.all for parallel fetching)
        const emails = await Promise.all(listData.messages.map(async (msg: any) => {
            const detailResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const detail = await detailResponse.json();

            // Extract headers
            const from = detail.payload.headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
            const subject = detail.payload.headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';

            return {
                id: detail.id,
                from: from.replace(/<.*>/, '').trim(), // Clean up "Name <email>" format
                subject: subject,
                snippet: detail.snippet,
                date: new Date(parseInt(detail.internalDate)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUnread: detail.labelIds?.includes('UNREAD')
            };
        }));

        return emails;
    } catch (error) {
        console.error("Gmail API Error:", error);
        return [];
    }
};

export const fetchUserEvents = async (accessToken: string): Promise<GoogleCalendarEvent[]> => {
    try {
        const timeMin = new Date().toISOString();
        const timeMax = new Date(new Date().setHours(23, 59, 59)).toISOString(); // End of today

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map((event: any) => ({
            id: event.id,
            title: event.summary || 'Untitled Event',
            startTime: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day',
            endTime: event.end.dateTime ? new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            meetLink: event.hangoutLink,
            colorId: event.colorId // Google colors are numeric IDs, mapped in UI later
        }));
    } catch (error) {
        console.error("Calendar API Error:", error);
        return [];
    }
};

export const fetchUserFiles = async (accessToken: string): Promise<GoogleDriveFile[]> => {
    try {
        const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(id,name,mimeType,thumbnailLink,webViewLink,iconLink)&orderBy=modifiedTime desc', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await response.json();

        if (!data.files) return [];

        return data.files.map((file: any) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            thumbnailLink: file.thumbnailLink,
            webViewLink: file.webViewLink,
            iconLink: file.iconLink
        }));
    } catch (error) {
        console.error("Drive API Error:", error);
        return [];
    }
};

// --- KEEPING MOCKS FOR FALLBACK/DEMO ---
export const getMockEmails = (): GoogleEmail[] => [
    { id: '1', from: 'Google Cloud', subject: 'Your monthly invoice is available', snippet: 'Your invoice for January 2026 is ready...', date: '10:30 AM', isUnread: false },
    { id: '2', from: 'Client: TechCorp', subject: 'Re: Project Proposal for Q1', snippet: 'Looks good! Can we schedule a call?', date: '9:15 AM', isUnread: true },
    { id: '3', from: 'Product Team', subject: 'Daily Standup - Join Link', snippet: 'Here is the link for today\'s standup...', date: '8:55 AM', isUnread: false },
];

export const getMockEvents = (): GoogleCalendarEvent[] => [
    { id: 'e1', title: 'Product Review', startTime: '11:00 AM', endTime: '12:00 PM', meetLink: 'https://meet.google.com/abc-defg-hij', colorId: '1' },
    { id: 'e2', title: 'Client Meeting', startTime: '2:00 PM', endTime: '3:00 PM', meetLink: 'https://meet.google.com/xyz-uvw-typ', colorId: '2' },
];

export const getMockFiles = (): GoogleDriveFile[] => [
    { id: 'f1', name: 'Financial Plan Q1.xlsx', mimeType: 'application/vnd.google-apps.spreadsheet' },
    { id: 'f2', name: 'Marketing Strategy.docx', mimeType: 'application/vnd.google-apps.document' },
];
