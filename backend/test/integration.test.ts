import request from 'supertest'
import { app } from '../src/app'

describe('integration', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('GET /api/events', async () => {
    const res = await request(app).get('/api/events')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.events)).toBe(true)
    expect(res.body.events[0]).toHaveProperty('title')
  })

  it('POST /api/events creates a new event when payload is valid', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Advanced Alpine Training',
      description: 'Multi-day expedition prep covering altitude readiness.',
      location: 'Leh',
      startDate: '2026-02-01T09:00:00.000Z',
      endDate: '2026-02-05T18:00:00.000Z',
      difficulty: 'ADVANCED',
      capacity: 15,
    })
    expect(res.status).toBe(201)
    expect(res.body.event.title).toBe('Advanced Alpine Training')
  })

  it('POST /api/events rejects invalid payload', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Bad Event',
      description: 'short',
      location: 'X',
      startDate: '2026-02-10T09:00:00.000Z',
      endDate: '2026-02-05T18:00:00.000Z',
      difficulty: 'INVALID',
      capacity: -10,
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('VALIDATION_ERROR')
  })
})
