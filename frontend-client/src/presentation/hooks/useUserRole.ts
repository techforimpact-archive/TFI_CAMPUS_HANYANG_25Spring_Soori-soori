import { useQuery } from '@tanstack/react-query'
import { getAuth, signOut } from 'firebase/auth'

import { userRepositorySoori } from '@/data/services/services'

import { useAuthState } from './useAuthState'

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuthState()

  const {
    data: userRole,
    isLoading: roleLoading,
    isError,
  } = useQuery({
    queryKey: ['role', user?.uid],
    queryFn: async () => {
      if (!user) {
        return null
      }

      try {
        const token = await user.getIdToken()
        return await userRepositorySoori.getUserRole(token)
      } catch {
        const auth = getAuth()
        await signOut(auth)
        return null
      }
    },
    enabled: !!user,
    retry: 1,
    placeholderData: (prev) => prev,
  })

  const isLoading = authLoading || roleLoading

  const safeUserRole = isError ? null : userRole

  const isAdmin = safeUserRole === 'admin'
  const isRepairer = safeUserRole === 'repairer'
  const isUser = safeUserRole === 'user'
  const isGuardian = safeUserRole === 'guardian'

  return {
    userRole: safeUserRole,
    isLoading,
    isError,
    isAdmin,
    isRepairer,
    isUser,
    isGuardian,
  }
}
