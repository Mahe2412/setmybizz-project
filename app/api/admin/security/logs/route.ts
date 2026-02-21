import { NextResponse } from 'next/server';
import { SecurityGuard } from '@/lib/security-guard';

export async function GET(request: Request) {
    // Basic Admin Protection
    // In production, verify Admin session/token here
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple safeguard for now
    if (secret !== process.env.ADMIN_SECRET_KEY && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const logs = SecurityGuard.getAuditLogs(100);
        const stats = SecurityGuard.getSecurityStats();

        return NextResponse.json({
            success: true,
            stats,
            logs
        });
    } catch (error) {
        console.error("Security Logs Error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
