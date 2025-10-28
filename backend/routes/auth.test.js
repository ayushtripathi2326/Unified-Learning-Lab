import { describe, it, expect } from 'vitest';

describe('Auth Routes', () => {
    it('should return a 200 status for the auth route', async () => {
        const response = await fetch('/api/auth');
        expect(response.status).toBe(200);
    });
});