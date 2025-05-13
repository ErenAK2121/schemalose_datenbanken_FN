<template>
  <div class="register-container">
    <ModernCard>
      <h1>Registrieren</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Benutzername:</label>
          <input type="text" 
          id="username" 
          v-model="username" 
          placeholder="Benutzername"
          required />
        </div>
        <div class="form-group">
          <label for="password">Passwort:</label>
          <input type="password" 
          id="password" 
          v-model="password"
          placeholder="Passwort eingeben"
          required />
        </div>
        <button type="submit" class="register-button">Registrieren</button>
        <p v-if="registrationError" class="error-message">
          {{ registrationError }}
        </p>
        <p v-if="registrationSuccess" class="success-message">
          {{ registrationSuccess }}
        </p>

        <div class="login-link">
        Bereits registriert?
        <router-link to="/login">Jetzt einloggen</router-link> 
      </div>
      </form>
    </ModernCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ModernCard from "@/components/ModernCard.vue";

import { useAuthStore } from "@/stores/auth/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const registrationError = ref("");
const registrationSuccess = ref("");

const register = async () => {
  registrationError.value = "";
  registrationSuccess.value = "";

 

  try {
    await authStore.register({
      username: username.value,
      password: password.value
    });
    
    registrationSuccess.value = "Registrierung erfolgreich!";
    
    // Kurze Verzögerung vor der Weiterleitung
    setTimeout(() => {
      router.push('/login');
    }, 1500);
    
  } catch (error: any) {
    registrationError.value = error.message || "Es gab einen Fehler bei der Registrierung.";
    console.error("Registrierungsfehler:", error);
  }

};
</script>

<style scoped>
.register-container {
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

.register-button {
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

.register-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  color: #4caf50;
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
}
</style>