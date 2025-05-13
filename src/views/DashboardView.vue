<template>
  <div class="dashboard-container">
    <ModernCard>
      <h1>Dashboard</h1>
      
      <div class="user-info" v-if="user">
        <h2>Willkommen, {{ user.username }}!</h2>
      </div>
      
      <div class="session-info" v-if="sessionId">
        <h3>Session Information</h3>
        <p>Session ID: {{ sessionId }}</p>
        <p>Diese Session wird im Memcached-Server verwaltet.</p>
      </div>
      
      <div class="actions">
        <button @click="handleLogout" class="logout-button">Abmelden</button>
      </div>
    </ModernCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModernCard from '@/components/ModernCard.vue'
import { useAuthStore } from '@/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()
const user = ref(authStore.user)
const sessionId = ref(authStore.sessionId)

onMounted(async () => {
  // Aktuelles Benutzerprofil laden, wenn es noch nicht geladen wurde
  if (!user.value) {
    try {
      await authStore.fetchUserProfile()
      user.value = authStore.user
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: var(--color-heading);
}

h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 20px;
  color: var(--color-heading);
}

h3 {
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: 18px;
  color: var(--color-heading);
}

.user-info, .session-info {
  background-color: var(--color-background-soft);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
}

p {
  margin: 8px 0;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.logout-button {
  padding: 12px 24px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c62828;
}
</style>