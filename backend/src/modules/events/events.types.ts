export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface EventEntity {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  difficulty: Difficulty
  capacity: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventInput {
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  difficulty: Difficulty
  capacity: number
}

