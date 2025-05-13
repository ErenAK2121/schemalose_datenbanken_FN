import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interface für Benutzer-Daten
interface User {
  id: number;
  username: string;
  email: string;
}

// Interface für API-Fehlermeldungen
interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

// API URL Konfiguration
const API_URL = 'http://localhost:8000/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const sessionId = ref<string>('')
  const loading = ref<boolean>(false)

  // Beim Initialisieren des Stores Token aus dem localStorage laden
  if (localStorage.getItem('auth_token')) {
    token.value = localStorage.getItem('auth_token') || ''
    sessionId.value = localStorage.getItem('auth_session_id') || ''
    
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
   * Benutzer mit Benutzernamen und Passwort anmelden
   */
  async function login(username: string, password: string): Promise<void> {
    loading.value = true
    
    try {
      // Django REST API Endpunkt für Login
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.detail || errorData.message || 'Login fehlgeschlagen')
      }

      const data = await response.json()

      // Tokens und Benutzerdaten speichern
      token.value = data.token
      sessionId.value = data.session_id
      user.value = data.user
      
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('auth_session_id', sessionId.value)
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
      // Server-seitiges Logout bei Django
      if (token.value) {
        await fetch(`${API_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token.value}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId.value }),
          credentials: 'include'
        }).catch(err => console.warn('Logout request failed:', err))
      }
    } finally {
      // Lokale Daten unabhängig vom Serverergebnis löschen
      clearAuthData()
    }
  }

  /**
   * Neuen Benutzer registrieren
   */
  async function register(userData: {username: string, email: string, password: string}): Promise<void> {
    loading.value = true
    
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
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
      
      // Erfolgreiches Registrieren
      const data = await response.json()
      return data
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Aktuelles Benutzerprofil abrufen
   */
  async function fetchUserProfile(): Promise<User | null> {
    if (!token.value) return null
    
    loading.value = true
    
    try {
      const response = await fetch(`${API_URL}/auth/user/`, {
        headers: {
          'Authorization': `Token ${token.value}`,
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token ist abgelaufen oder ungültig
          clearAuthData()
          return null
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
   * Authentifizierungsdaten löschen
   */
  function clearAuthData(): void {
    user.value = null
    token.value = ''
    sessionId.value = ''
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_session_id')
    localStorage.removeItem('auth_user')
  }

  /**
   * Prüft, ob der Benutzer angemeldet ist
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
    sessionId,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    fetchUserProfile,
    checkAuth
  }
})