import React from 'react'
import { createRoot } from 'react-dom/client'

interface Event {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  capacity: number
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function App() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/events')
      .then((response) => response.json())
      .then((payload) => {
        if (cancelled) return
        if (!payload?.events || !Array.isArray(payload.events)) {
          setError('Malformed events payload')
          return
        }
        setEvents(payload.events as Event[])
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError('Unable to load events. Please retry in a moment.')
        setEvents([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <h1>MountainLover - Events</h1>
      {error && <p role="alert">{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> · {event.location} ·{' '}
            {dateFormatter.format(new Date(event.startDate))} →{' '}
            {dateFormatter.format(new Date(event.endDate))}
          </li>
        ))}
      </ul>
    </main>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}

export default App
