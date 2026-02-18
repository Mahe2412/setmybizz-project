// Security Guard - Multi-layer protection system
// Prevents prompt injection, data leaks, and unauthorized access

interface SecurityCheckResult {
    allowed: boolean;
    reason?: string;
    sanitizedInput?: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditLog {
    timestamp: Date;
    userId: string;
    input: string;
    output?: string;
    blocked: boolean;
    reason?: string;
    riskLevel: string;
}

export class SecurityGuard {
    // Attack pattern detection
    private static readonly PROMPT_INJECTION_PATTERNS = [
        // Direct instruction override
        /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|commands?|rules?)/i,
        /forget\s+(everything|all|what|previous)/i,
        /disregard\s+(all\s+)?(previous|above|prior)/i,
        /new\s+(instructions?|commands?|rules?)[:]/i,

        // Role manipulation
        /(you\s+are|you're)\s+now\s+/i,
        /act\s+as\s+(if|a|an)\s+/i,
        /pretend\s+(you\s+are|to\s+be)/i,
        /behave\s+like/i,

        // System prompt extraction
        /what\s+(is|are)\s+(your|the)\s+(instructions?|rules?|prompt)/i,
        /show\s+(me\s+)?(your|the)\s+(system|original)\s+prompt/i,
        /repeat\s+(your|the)\s+(instructions?|prompt)/i,
        /system\s+prompt[:]/i,

        // Secret/sensitive data extraction
        /reveal\s+(your|the|all)\s+(secret|password|key|token)/i,
        /show\s+(me\s+)?(all\s+)?(api|secret|private)\s+key/i,
        /what\s+(is|are)\s+(your|the)\s+(api|secret)\s+key/i,
        /dump\s+(database|data|table)/i,

        // Code injection
        /<script[^>]*>/i,
        /javascript:/i,
        /onerror\s*=/i,
        /eval\s*\(/i,
        /\.execute\(/i,

        // SQL injection
        /'\s*(OR|AND)\s*'?1'?\s*=\s*'?1/i,
        /UNION\s+SELECT/i,
        /DROP\s+TABLE/i,
        /DELETE\s+FROM/i,
        /--\s*$/i,
    ];

    // Sensitive output patterns to redact
    private static readonly SENSITIVE_OUTPUT_PATTERNS = [
        // API Keys
        { pattern: /AIza[0-9A-Za-z_-]{35}/g, replacement: '[API_KEY_REDACTED]' },
        { pattern: /sk-[a-zA-Z0-9]{48}/g, replacement: '[API_KEY_REDACTED]' },
        { pattern: /[a-f0-9]{32}/g, replacement: '[TOKEN_REDACTED]' },

        // Credentials
        { pattern: /password\s*[:=]\s*["']?[^"'\s]+["']?/gi, replacement: 'password: [REDACTED]' },
        { pattern: /token\s*[:=]\s*["']?[^"'\s]+["']?/gi, replacement: 'token: [REDACTED]' },
        { pattern: /secret\s*[:=]\s*["']?[^"'\s]+["']?/gi, replacement: 'secret: [REDACTED]' },

        // Indian IDs
        { pattern: /\b\d{12}\b/g, replacement: '[AADHAAR_REDACTED]' },
        { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: '[PAN_REDACTED]' },
        { pattern: /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}\b/g, replacement: '[GSTIN_REDACTED]' },

        // Financial data (for non-owners)
        { pattern: /cost\s+price\s*[:=]?\s*₹?[\d,]+/gi, replacement: 'cost price: [REDACTED]' },
        { pattern: /margin\s*[:=]?\s*[\d.]+%/gi, replacement: 'margin: [REDACTED]%' },
        { pattern: /wholesale\s+price\s*[:=]?\s*₹?[\d,]+/gi, replacement: 'wholesale price: [REDACTED]' },
        { pattern: /supplier\s+cost\s*[:=]?\s*₹?[\d,]+/gi, replacement: 'supplier cost: [REDACTED]' },

        // Email addresses
        { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL_REDACTED]' },

        // Phone numbers
        { pattern: /(\+91|0)?[6-9]\d{9}/g, replacement: '[PHONE_REDACTED]' },

        // System prompts (if leaked)
        { pattern: /You are (an|a) AI (assistant|co-founder).{0,500}instructions?:/gi, replacement: '' },
    ];

    // Rate limiting storage (in-memory, use Redis in production)
    private static rateLimitMap = new Map<string, { count: number; resetAt: number }>();

    // Audit log storage
    private static auditLogs: AuditLog[] = [];

    /**
     * Primary input validation - checks for malicious content
     */
    static validateInput(input: string, userId: string, userRole: string = 'user'): SecurityCheckResult {
        // 1. Check rate limiting
        if (!this.checkRateLimit(userId, this.getRateLimit(userRole))) {
            return {
                allowed: false,
                reason: 'Rate limit exceeded. Please wait a moment.',
                riskLevel: 'medium'
            };
        }

        // 2. Basic validation
        if (!input || input.trim().length === 0) {
            return {
                allowed: false,
                reason: 'Empty input',
                riskLevel: 'low'
            };
        }

        if (input.length > 2000) {
            return {
                allowed: false,
                reason: 'Input too long (max 2000 characters)',
                riskLevel: 'medium'
            };
        }

        // 3. Detect prompt injection
        const injectionDetected = this.detectPromptInjection(input);
        if (injectionDetected) {
            this.logSecurityIncident(userId, input, 'prompt_injection', 'high');
            return {
                allowed: false,
                reason: 'Invalid request. Please ask a specific business question.',
                riskLevel: 'high'
            };
        }

        // 4. Detect code injection
        if (this.detectCodeInjection(input)) {
            this.logSecurityIncident(userId, input, 'code_injection', 'critical');
            return {
                allowed: false,
                reason: 'Invalid characters detected.',
                riskLevel: 'critical'
            };
        }

        // 5. Sanitize input
        const sanitized = this.sanitizeInput(input);

        return {
            allowed: true,
            sanitizedInput: sanitized,
            riskLevel: 'low'
        };
    }

    /**
     * Output filtering - removes sensitive data before showing to user
     */
    static filterOutput(output: string, userRole: string = 'user'): string {
        let filtered = output;

        // Apply all redaction patterns
        for (const { pattern, replacement } of this.SENSITIVE_OUTPUT_PATTERNS) {
            filtered = filtered.replace(pattern, replacement);
        }

        // Role-based filtering
        if (userRole !== 'owner') {
            // Additional filtering for non-owners
            // Remove any pricing strategy discussion
            filtered = filtered.replace(/pricing\s+strategy.{0,200}/gi, '[PRICING_STRATEGY_REDACTED]');
            filtered = filtered.replace(/competitive\s+advantage.{0,200}/gi, '[COMPETITIVE_INFO_REDACTED]');
        }

        return filtered;
    }

    /**
     * Detect prompt injection attempts
     */
    private static detectPromptInjection(input: string): boolean {
        return this.PROMPT_INJECTION_PATTERNS.some(pattern => pattern.test(input));
    }

    /**
     * Detect code injection attempts
     */
    private static detectCodeInjection(input: string): boolean {
        const codePatterns = [
            /<script[^>]*>/i,
            /javascript:/i,
            /onerror\s*=/i,
            /onclick\s*=/i,
            /eval\s*\(/i,
        ];

        return codePatterns.some(pattern => pattern.test(input));
    }

    /**
     * Sanitize input by removing potentially harmful content
     */
    private static sanitizeInput(input: string): string {
        let sanitized = input;

        // Remove HTML tags
        sanitized = sanitized.replace(/<[^>]*>/g, '');

        // Remove SQL comment markers
        sanitized = sanitized.replace(/--/g, '');

        // Trim and normalize whitespace
        sanitized = sanitized.trim().replace(/\s+/g, ' ');

        return sanitized;
    }

    /**
     * Rate limiting check
     */
    private static checkRateLimit(userId: string, limit: number): boolean {
        const now = Date.now();
        const userLimit = this.rateLimitMap.get(userId);

        if (!userLimit || now > userLimit.resetAt) {
            // Reset counter every minute
            this.rateLimitMap.set(userId, {
                count: 1,
                resetAt: now + 60000
            });
            return true;
        }

        if (userLimit.count >= limit) {
            return false; // Rate limit exceeded
        }

        userLimit.count++;
        return true;
    }

    /**
     * Get rate limit based on user role
     */
    private static getRateLimit(role: string): number {
        const limits: Record<string, number> = {
            owner: 60,
            manager: 30,
            employee: 20,
            user: 10
        };

        return limits[role] || 10;
    }

    /**
     * Log security incidents for monitoring
     */
    private static logSecurityIncident(
        userId: string,
        input: string,
        reason: string,
        riskLevel: string
    ): void {
        const log: AuditLog = {
            timestamp: new Date(),
            userId,
            input: this.hashSensitiveData(input),
            blocked: true,
            reason,
            riskLevel
        };

        this.auditLogs.push(log);

        // In production, send to monitoring service
        console.warn('Security incident detected:', {
            userId,
            reason,
            riskLevel,
            timestamp: log.timestamp
        });

        // Alert admin if critical
        if (riskLevel === 'critical') {
            this.alertAdmin(log);
        }
    }

    /**
     * Log successful interaction
     */
    static logInteraction(
        userId: string,
        input: string,
        output: string,
        tokensUsed: number
    ): void {
        const log: AuditLog = {
            timestamp: new Date(),
            userId,
            input: this.hashSensitiveData(input),
            output: this.hashSensitiveData(output),
            blocked: false,
            riskLevel: 'low'
        };

        this.auditLogs.push(log);

        // Keep only last 1000 logs in memory
        if (this.auditLogs.length > 1000) {
            this.auditLogs = this.auditLogs.slice(-1000);
        }
    }

    /**
     * Hash sensitive data for logging
     */
    private static hashSensitiveData(data: string): string {
        // In production, use proper hashing
        // For now, truncate and mask
        if (data.length > 100) {
            return data.substring(0, 50) + '...[TRUNCATED]...' + data.substring(data.length - 20);
        }
        return data;
    }

    /**
     * Alert admin about critical security incident
     */
    private static alertAdmin(log: AuditLog): void {
        // In production, send email/SMS/Slack notification
        console.error('🚨 CRITICAL SECURITY ALERT:', {
            userId: log.userId,
            reason: log.reason,
            timestamp: log.timestamp
        });

        // TODO: Implement actual alerting (email, Slack, etc.)
    }

    /**
     * Get audit logs for monitoring
     */
    static getAuditLogs(limit: number = 100): AuditLog[] {
        return this.auditLogs.slice(-limit);
    }

    /**
     * Get security statistics
     */
    static getSecurityStats(): {
        totalRequests: number;
        blockedRequests: number;
        criticalIncidents: number;
        blockRate: number;
    } {
        const total = this.auditLogs.length;
        const blocked = this.auditLogs.filter(log => log.blocked).length;
        const critical = this.auditLogs.filter(log => log.riskLevel === 'critical').length;

        return {
            totalRequests: total,
            blockedRequests: blocked,
            criticalIncidents: critical,
            blockRate: total > 0 ? (blocked / total) * 100 : 0
        };
    }
}

// Export types
export type { SecurityCheckResult, AuditLog };
