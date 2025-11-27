import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './main'

test('renders title', () => {
  render(<App />)
  expect(screen.getByText(/MountainLover - Events/i)).toBeInTheDocument()
})
