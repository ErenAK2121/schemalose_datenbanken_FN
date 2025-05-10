<!-- filepath: /home/lthustensaft/Documents/studium/schemelose_datenbanken/projekt/schemalose_datenbanken_FN/src/views/LoginView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Muss noch erstellt werden
import { useAuthStore } from '@/stores/auth/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    errorMessage.value = ''
    
    if (!email.value || !password.value) {
      errorMessage.value = 'Bitte füllen Sie alle Felder aus.'
      return
    }
    
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Anmeldung</h1>
      
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input 
          type="username" 
          id="username" 
          v-model="username" 
          placeholder="Benutzername"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">Passwort</label>
        <input 
          type="password" 
          id="password" 
          v-model="password"
          placeholder="Passwort eingeben"
          required
        />
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <button @click="login" class="login-button">Einloggen</button>
      
      <div class="register-link">
        Noch kein Konto? 
        <router-link to="/register">Jetzt registrieren</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: var(--color-heading);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

.login-button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: #4caf50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .login-form {
    background-color: var(--color-background-soft);
  }
}
</style>