import { NextRequest, NextResponse } from 'next/server';
import { SecurityGuard } from '@/lib/security-guard';

// Security monitoring endpoint (admin only)
export async function GET(req: NextRequest) {
    try {
        // TODO: Add proper authentication
        // For now, check for admin token
        const authHeader = req.headers.get('authorization');
        const adminToken = process.env.ADMIN_SECRET_TOKEN || 'dev-admin-token';

        if (authHeader !== `Bearer ${adminToken}`) {
            return NextResponse.json({
                error: 'Unauthorized',
                success: false
            }, { status: 401 });
        }

        // Get query parameters
        const url = new URL(req.url);
        const action = url.searchParams.get('action') || 'stats';
        const limit = parseInt(url.searchParams.get('limit') || '100');

        switch (action) {
            case 'stats':
                const stats = SecurityGuard.getSecurityStats();
                return NextResponse.json({
                    success: true,
                    data: stats
                });

            case 'logs':
                const logs = SecurityGuard.getAuditLogs(limit);
                return NextResponse.json({
                    success: true,
                    data: logs,
                    count: logs.length
                });

            default:
                return NextResponse.json({
                    error: 'Invalid action. Use ?action=stats or ?action=logs',
                    success: false
                }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Security monitoring error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to get security data',
            success: false
        }, { status: 500 });
    }
}
