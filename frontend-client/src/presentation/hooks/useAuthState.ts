import { useState, useEffect } from 'react'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

export function useAuthState() {
  const auth = getAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [auth])

  return { user, loading, error }
}
