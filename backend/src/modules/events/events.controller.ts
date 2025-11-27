import { Request, Response } from 'express'
import { EventService } from './events.service'
import { CreateEventInput } from './events.types'

export class EventsController {
  constructor(private readonly service: EventService) {}

  listEvents = async (_req: Request, res: Response) => {
    const events = await this.service.listEvents()
    return res.json({ events })
  }

  createEvent = async (req: Request, res: Response) => {
    const payload = req.body as CreateEventInput
    const event = await this.service.createEvent(payload)
    return res.status(201).json({ event })
  }
}

