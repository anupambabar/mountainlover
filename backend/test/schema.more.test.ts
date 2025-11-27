import { describe, it, expect } from 'vitest'
import { UserSchema } from '../src/schema'

describe('UserSchema - additional cases', () => {
  it('accepts valid user with email', () => {
    const parsed = UserSchema.parse({
      firstName: 'Al',
      lastName: 'Be',
      phone: '123456',
      email: 'a@b.com',
    })
    expect(parsed.email).toBe('a@b.com')
  })

  it('rejects invalid email type', () => {
    const payload = { firstName: 'A', lastName: 'B', phone: '123456', email: 123 } as unknown
    expect(() => UserSchema.parse(payload)).toThrow()
  })

  it('rejects missing firstName', () => {
    const payload = { lastName: 'B', phone: '123456' } as unknown
    expect(() => UserSchema.parse(payload)).toThrow()
  })

  it('rejects missing lastName', () => {
    const payload = { firstName: 'A', phone: '123456' } as unknown
    expect(() => UserSchema.parse(payload)).toThrow()
  })
})
