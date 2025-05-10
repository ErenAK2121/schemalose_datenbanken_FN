import { useAuthStore } from '../stores/auth/useAuthStore'
export async function requireAuth(to: any, from: any, next: any) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Wenn kein Token vorhanden ist, zur Login-Seite weiterleiten
    return next({ name: 'login' })
  }
  
  try {
    // Token validieren und Benutzer abrufen
    const isAuthenticated = await authStore.checkAuth()
    
    if (isAuthenticated) {
      next() // Zugriff erlauben
    } else {
      next({ name: 'login' }) // Zur Login-Seite weiterleiten
    }
  } catch (error) {
    console.error('Auth guard error:', error)
    next({ name: 'login' })
  }
}