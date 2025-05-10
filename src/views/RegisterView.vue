<template>
  <ModernCard>
    <div class="register-container">
      <h1>Registrieren</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Benutzername:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">E-Mail:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Passwort:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Passwort bestätigen:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>
        <button type="submit" class="register-button">Registrieren</button>
        <p v-if="registrationError" class="error-message">
          {{ registrationError }}
        </p>
        <p v-if="registrationSuccess" class="success-message">
          {{ registrationSuccess }}
        </p>
      </form>
    </div>
  </ModernCard>
</template>

<script>

import { ref } from "vue";
import ModernCard from "@/components/ModernCard.vue";

export default {
  name: "RegisterView",
  setup() {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const registrationError = ref("");
    const registrationSuccess = ref("");

    const register = async () => {
      registrationError.value = "";
      registrationSuccess.value = "";

      if (password.value !== confirmPassword.value) {
        registrationError.value = "Die Passwörter stimmen nicht überein.";
        return;
      }

      // Hier könntest du deine API-Anfrage zum Registrieren implementieren
      // Zum Beispiel mit fetch oder Axios:
      try {
        const response = await fetch("/api/register", {
          // Passe die API-Route an
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          registrationSuccess.value = "Registrierung erfolgreich!";
          // Optional: Weiterleitung des Benutzers nach der Registrierung
          // router.push('/login');
        } else {
          registrationError.value =
            data.message || "Registrierung fehlgeschlagen.";
        }
      } catch (error) {
        registrationError.value = "Es gab einen Fehler bei der Registrierung.";
        console.error("Registrierungsfehler:", error);
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      registrationError,
      registrationSuccess,
      register,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  width: 300px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
