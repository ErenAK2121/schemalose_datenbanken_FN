<template>
  <div class="login-container">
    <ModernCard>
      <h1>Anmeldung</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Benutzername:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Benutzername"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Passwort:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            placeholder="Passwort eingeben"
            required
          />
        </div>
        
        <button type="submit" class="login-button">Einloggen</button>
        
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
        
        <div class="register-link">
          Noch kein Konto? 
          <router-link to="/register">Jetzt registrieren</router-link>
        </div>
      </form>
    </ModernCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModernCard from "@/components/ModernCard.vue"
import { useAuthStore } from '@/stores/auth/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    errorMessage.value = ''
    
    if (!username.value || !password.value) {
      errorMessage.value = 'Bitte füllen Sie alle Felder aus.'
      return
    }
    
    await authStore.login(username.value, password.value)
    router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
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
  width: 100%;
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
  margin-top: 16px;
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
</style>