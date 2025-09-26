import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { AuthError } from '@supabase/supabase-js'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at
      } : null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at
      } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error while contacting Supabase'
      return { data: null, error: { message } as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error while contacting Supabase'
      return { data: null, error: { message } as AuthError }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }


  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}