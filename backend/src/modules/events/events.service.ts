import { sanitizeText } from '../../utils/sanitize'
import { CreateEventInput, EventEntity } from './events.types'
import { EventRepository } from './events.repository'

export class EventService {
  constructor(private readonly repository: EventRepository) {}

  async listEvents(): Promise<EventEntity[]> {
    return this.repository.findAll()
  }

  async createEvent(input: CreateEventInput): Promise<EventEntity> {
    const sanitized: CreateEventInput = {
      ...input,
      title: sanitizeText(input.title),
      description: sanitizeText(input.description),
      location: sanitizeText(input.location),
    }
    return this.repository.create(sanitized)
  }
}

