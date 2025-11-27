import { randomUUID } from 'crypto'
import { CreateEventInput, EventEntity } from './events.types'
import { sanitizeText } from '../../utils/sanitize'

export interface EventRepository {
  findAll(): Promise<EventEntity[]>
  create(input: CreateEventInput): Promise<EventEntity>
}

export class InMemoryEventRepository implements EventRepository {
  private events: EventEntity[] = [
    {
      id: randomUUID(),
      title: 'Intro Trek',
      description: 'Guided trek for first-time hikers focusing on safety and pacing.',
      location: 'Manali',
      startDate: '2026-01-15T09:00:00.000Z',
      endDate: '2026-01-17T17:00:00.000Z',
      difficulty: 'BEGINNER',
      capacity: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  async findAll(): Promise<EventEntity[]> {
    return [...this.events]
  }

  async create(input: CreateEventInput): Promise<EventEntity> {
    const entity: EventEntity = {
      id: randomUUID(),
      title: sanitizeText(input.title),
      description: sanitizeText(input.description),
      location: sanitizeText(input.location),
      startDate: input.startDate,
      endDate: input.endDate,
      difficulty: input.difficulty,
      capacity: input.capacity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.events.push(entity)
    return entity
  }
}

