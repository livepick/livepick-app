import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { isLoggedIn, currentUser, isPartner, mode, toggleAuth } =
    useAuthStore()

  return {
    isLoggedIn,
    currentUser,
    isPartner,
    mode,
    toggleAuth,
  }
}
