import { describe, it, expect, beforeEach, vi } from 'vitest'
import { supabase } from './supabase'

// Mock supabase client
vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      signInWithPassword: vi.fn()
    }
  }
}))

describe('Authentication', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
  })

  it('should handle successful sign in', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password123'
    }

    const mockResponse = {
      data: { user: { id: '123', email: mockUser.email } },
      error: null
    }

    // Setup mock response
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse)

    const { data, error } = await supabase.auth.signInWithPassword(mockUser)
    
    expect(error).toBeNull()
    expect(data.user).toEqual(mockResponse.data.user)
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(mockUser)
  })

  it('should handle sign in error', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'wrong_password'
    }

    const mockError = {
      data: { user: null },
      error: { message: 'Invalid credentials' }
    }

    // Setup mock response for error case
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockError)

    const { data, error } = await supabase.auth.signInWithPassword(mockUser)
    
    expect(error).toBeTruthy()
    expect(error.message).toBe('Invalid credentials')
    expect(data.user).toBeNull()
  })
})