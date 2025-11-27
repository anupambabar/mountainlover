import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { eventsRouter } from './modules/events/events.routes'

dotenv.config()
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/events', eventsRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
})

export { app }
