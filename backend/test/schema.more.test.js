"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const schema_1 = require("../src/schema");
(0, vitest_1.describe)('UserSchema - additional cases', () => {
    (0, vitest_1.it)('accepts valid user with email', () => {
        const parsed = schema_1.UserSchema.parse({
            firstName: 'Al',
            lastName: 'Be',
            phone: '123456',
            email: 'a@b.com',
        });
        (0, vitest_1.expect)(parsed.email).toBe('a@b.com');
    });
    (0, vitest_1.it)('rejects invalid email type', () => {
        const payload = { firstName: 'A', lastName: 'B', phone: '123456', email: 123 };
        (0, vitest_1.expect)(() => schema_1.UserSchema.parse(payload)).toThrow();
    });
    (0, vitest_1.it)('rejects missing firstName', () => {
        const payload = { lastName: 'B', phone: '123456' };
        (0, vitest_1.expect)(() => schema_1.UserSchema.parse(payload)).toThrow();
    });
    (0, vitest_1.it)('rejects missing lastName', () => {
        const payload = { firstName: 'A', phone: '123456' };
        (0, vitest_1.expect)(() => schema_1.UserSchema.parse(payload)).toThrow();
    });
});
