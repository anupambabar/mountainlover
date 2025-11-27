import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './main'
import { vi } from 'vitest'

describe('App fetch behavior', () => {
  const originalFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('renders events when fetch succeeds', async () => {
    const mockFetch = vi.fn(async () => ({
      json: async () => ({
        events: [
          {
            id: '1',
            title: 'Intro Trek',
            description: 'desc',
            location: 'Manali',
            startDate: '2026-01-15T00:00:00.000Z',
            endDate: '2026-01-16T00:00:00.000Z',
            difficulty: 'BEGINNER',
            capacity: 20,
          },
        ],
      }),
    }))
    globalThis.fetch = mockFetch as unknown as typeof fetch
    render(<App />)
    await waitFor(() => expect(screen.getByText(/Intro Trek/)).toBeInTheDocument())
  })

  it('handles fetch failure gracefully', async () => {
    const mockFetch = vi.fn(async () => {
      throw new Error('network')
    })
    globalThis.fetch = mockFetch as unknown as typeof fetch
    render(<App />)
    // should not throw; ensure title still present and no list items
    await waitFor(() => expect(screen.getByText(/MountainLover - Events/)).toBeInTheDocument())
    const items = screen.queryAllByRole('listitem')
    expect(items.length).toBe(0)
  })
})
