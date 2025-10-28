import { describe, it, expect } from 'vitest';

describe('Questions Route', () => {
    it('should return a list of questions', async () => {
        const response = await fetch('/api/questions');
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toBeInstanceOf(Array);
    });
});