<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
      Willkommen, {{ user?.username }}!
    </h1>

    <div class="space-y-2 text-gray-700">
      <p><strong>User-ID:</strong> {{ user?.id }}</p>
      <p><strong>Session-ID:</strong> {{ sessionId }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Session-ID aus localStorage lesen (falls vorhanden)
const sessionId = ref<string | null>(null)

onMounted(() => {
  sessionId.value = localStorage.getItem('auth_token')
})
</script>
