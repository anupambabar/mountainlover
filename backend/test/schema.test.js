"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const schema_1 = require("../src/schema");
(0, vitest_1.describe)('UserSchema', () => {
    (0, vitest_1.it)('validates a good user', () => {
        const parsed = schema_1.UserSchema.parse({ firstName: 'Al', lastName: 'Be', phone: '123456' });
        (0, vitest_1.expect)(parsed.firstName).toBe('Al');
    });
    (0, vitest_1.it)('rejects missing phone', () => {
        const payload = { firstName: 'A', lastName: 'B' };
        (0, vitest_1.expect)(() => schema_1.UserSchema.parse(payload)).toThrow();
    });
});
