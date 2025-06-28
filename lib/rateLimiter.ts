interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitRecord>();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 3600000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now >= record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true };
    }

    if (record.count >= this.limit) {
      return { 
        allowed: false, 
        resetTime: record.resetTime 
      };
    }

    record.count++;
    return { allowed: true };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now >= record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const geminiRateLimiter = new RateLimiter(10, 3600000);

setInterval(() => {
  geminiRateLimiter.cleanup();
}, 3600000);