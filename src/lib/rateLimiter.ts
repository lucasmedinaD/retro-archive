// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: Date } {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    // No previous attempts
    if (!record) {
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
    }

    // Lockout expired, reset
    if (now > record.resetAt) {
        loginAttempts.delete(ip);
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
    }

    // Still in lockout period
    if (record.count >= MAX_ATTEMPTS) {
        return {
            allowed: false,
            lockedUntil: new Date(record.resetAt)
        };
    }

    // Attempt allowed
    return {
        allowed: true,
        remainingAttempts: MAX_ATTEMPTS - record.count - 1
    };
}

export function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record || now > record.resetAt) {
        // First attempt or reset after expiry
        loginAttempts.set(ip, {
            count: 1,
            resetAt: now + LOCKOUT_DURATION
        });
    } else {
        // Increment count
        record.count++;
    }
}

export function clearAttempts(ip: string): void {
    loginAttempts.delete(ip);
}
