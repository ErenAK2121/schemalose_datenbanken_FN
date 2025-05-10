import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interface für Benutzer-Daten
interface User {
  id: number;
  username: string;
  email: string;
  // Weitere Benutzerfelder je nach Django-Benutzermodell
}

// Interface für Antwort des Django-Backends
interface AuthResponse {
  user: User;
  token: string;
  refresh?: string;
}

// Interface für API-Fehlermeldungen
interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const refreshToken = ref<string>('')
  const loading = ref<boolean>(false)

  // Beim Initialisieren des Stores Token aus dem localStorage laden
  if (localStorage.getItem('auth_token')) {
    token.value = localStorage.getItem('auth_token') || ''
    refreshToken.value = localStorage.getItem('auth_refresh_token') || ''
    
    // Optional: Gespeicherte Benutzerdaten laden
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Fehler beim Parsen der Benutzerdaten:', e)
      }
    }
  }

  // Computed Properties
  const isAuthenticated = computed(() => !!token.value)
  
  /**
   * Benutzer mit E-Mail und Passwort anmelden
   */
  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    
    try {
      // Django REST API Endpunkt für Login
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.detail || errorData.message || 'Login fehlgeschlagen')
      }

      const data: AuthResponse = await response.json()

      // Tokens und Benutzerdaten speichern
      token.value = data.token
      if (data.refresh) {
        refreshToken.value = data.refresh
        localStorage.setItem('auth_refresh_token', data.refresh)
      }
      
      user.value = data.user
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Benutzer abmelden
   */
  async function logout(): Promise<void> {
    try {
      // Optional: Server-seitiges Logout bei Django
      if (token.value) {
        await fetch('/api/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.warn('Logout request failed:', err))
      }
    } finally {
      // Lokale Daten unabhängig vom Serverergebnis löschen
      clearAuthData()
    }
  }

  /**
   * Token aktualisieren
   */
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    
    try {
      const response = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken.value }),
      })
      
      if (!response.ok) return false
      
      const data = await response.json()
      token.value = data.access
      localStorage.setItem('auth_token', token.value)
      
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  /**
   * Aktuelles Benutzerprofil abrufen
   */
  async function fetchUserProfile(): Promise<User | null> {
    if (!token.value) return null
    
    loading.value = true
    
    try {
      const response = await fetch('/api/auth/user/', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
      
      if (!response.ok) {
        // Bei 401 (Unauthorized) - Token ist abgelaufen
        if (response.status === 401) {
          const refreshSuccess = await refreshAccessToken()
          if (refreshSuccess) {
            // Token wurde aktualisiert, Anfrage erneut senden
            return fetchUserProfile()
          } else {
            // Token-Aktualisierung fehlgeschlagen, Benutzer abmelden
            clearAuthData()
            return null
          }
        }
        throw new Error('Fehler beim Abrufen des Benutzerprofils')
      }
      
      const userData: User = await response.json()
      user.value = userData
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Neuen Benutzer registrieren
   */
  async function register(userData: {username: string, email: string, password: string}): Promise<void> {
    loading.value = true
    
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        
        // Django REST Framework sendet oft Validierungsfehler als Objekt
        if (errorData.username || errorData.email || errorData.password) {
          const firstError = 
            errorData.username?.[0] || 
            errorData.email?.[0] || 
            errorData.password?.[0] || 
            'Registrierung fehlgeschlagen';
          
          throw new Error(firstError)
        }
        
        throw new Error(errorData.detail || errorData.message || 'Registrierung fehlgeschlagen')
      }
      
      // Optional: Automatisch nach der Registrierung anmelden
      // const data = await response.json();
      // Wenn die API die Benutzerdaten und Token zurückgibt, könnte man direkt einloggen
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Authentifizierungsdaten löschen
   */
  function clearAuthData(): void {
    user.value = null
    token.value = ''
    refreshToken.value = ''
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_refresh_token')
    localStorage.removeItem('auth_user')
  }

  /**
   * Prüft, ob der Benutzer angemeldet ist, und aktualisiert ggf. sein Profil
   */
  async function checkAuth(): Promise<boolean> {
    if (!token.value) return false
    
    try {
      // Benutzer abrufen um zu prüfen, ob der Token gültig ist
      const userData = await fetchUserProfile()
      return !!userData
    } catch (error) {
      console.error('Auth check failed:', error)
      clearAuthData()
      return false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    fetchUserProfile,
    checkAuth
  }
})