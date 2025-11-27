import { Router } from 'express'
import { EventsController } from './events.controller'
import { EventService } from './events.service'
import { InMemoryEventRepository } from './events.repository'
import { validateRequest } from '../../middleware/validateRequest'
import { EventCreateSchema } from './events.schema'

const repository = new InMemoryEventRepository()
const service = new EventService(repository)
const controller = new EventsController(service)

const eventsRouter = Router()
eventsRouter.get('/', controller.listEvents)
eventsRouter.post('/', validateRequest(EventCreateSchema), controller.createEvent)

export { eventsRouter }

