<template>
  <div class="postgresql-demo p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-green-600">🐘 PostgreSQL Backend Demo</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- API Status -->
      <div class="api-status">
        <h3 class="text-lg font-semibold mb-2">API Status</h3>
        <div class="flex items-center gap-2">
          <div :class="[
            'w-3 h-3 rounded-full',
            apiHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
          ]"></div>
          <span>{{ apiHealth?.status || 'Unknown' }}</span>
          <button 
            @click="checkHealth" 
            :disabled="isLoadingHealth"
            class="ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoadingHealth ? 'Checking...' : 'Check Health' }}
          </button>
        </div>
        <div v-if="apiHealth" class="text-sm text-gray-600 mt-1">
          Database: {{ apiHealth.database }} | {{ apiHealth.timestamp }}
        </div>
      </div>

      <!-- Person Management -->
      <div class="person-management">
        <h3 class="text-lg font-semibold mb-2">Person Management</h3>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">Total Persons:</span>
            <span class="font-bold">{{ personStore.getAllPersonList.length }}</span>
            <button 
              @click="loadPersons" 
              :disabled="personStore.isLoading"
              class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
            >
              {{ personStore.isLoading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="addDefaultPersons" 
              :disabled="personStore.isLoading"
              class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Add Default Persons
            </button>
            <button 
              @click="clearAllPersons" 
              :disabled="personStore.isLoading"
              class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="personStore.error" class="col-span-2 bg-red-50 border border-red-200 rounded p-3">
        <h4 class="text-red-700 font-semibold">Error:</h4>
        <p class="text-red-600 text-sm">{{ personStore.error }}</p>
      </div>
    </div>

    <!-- Session Info -->
    <div class="mt-6 p-4 bg-gray-50 rounded">
      <h3 class="text-lg font-semibold mb-2">Session Information</h3>
      <div class="text-sm">
        <p><strong>Session ID:</strong> <code class="bg-gray-200 px-1 rounded">{{ sessionId }}</code></p>
        <p class="text-gray-600 mt-1">Each user session gets isolated data in PostgreSQL</p>
      </div>
    </div>

    <!-- Person List -->
    <div v-if="personStore.getAllPersonList.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Current Persons ({{ personStore.getAllPersonList.length }})</h3>
      <div class="max-h-48 overflow-y-auto border rounded">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">Name</th>
              <th class="px-3 py-2 text-left">Department</th>
              <th class="px-3 py-2 text-left">Identity</th>
              <th class="px-3 py-2 text-center">Winner</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in personStore.getAllPersonList" :key="person.id" class="border-t">
              <td class="px-3 py-2">{{ person.name }}</td>
              <td class="px-3 py-2">{{ person.department }}</td>
              <td class="px-3 py-2">{{ person.identity }}</td>
              <td class="px-3 py-2 text-center">
                <span :class="[
                  'px-2 py-1 rounded text-xs',
                  person.isWin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                ]">
                  {{ person.isWin ? '🏆 Winner' : 'Not Won' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePersonConfigAPI } from '@/store/personConfigAPI'
import { healthAPI, getSessionId } from '@/api/services'
import { defaultPersonList } from '@/store/data'

const personStore = usePersonConfigAPI()
const apiHealth = ref<any>(null)
const isLoadingHealth = ref(false)
const sessionId = ref(getSessionId())

const checkHealth = async () => {
  isLoadingHealth.value = true
  try {
    apiHealth.value = await healthAPI.check()
  } catch (error) {
    console.error('Health check failed:', error)
    apiHealth.value = { status: 'unhealthy', database: 'disconnected' }
  } finally {
    isLoadingHealth.value = false
  }
}

const loadPersons = async () => {
  await personStore.loadPersons()
}

const addDefaultPersons = async () => {
  try {
    await personStore.setDefaultPersonList()
  } catch (error) {
    console.error('Failed to add default persons:', error)
  }
}

const clearAllPersons = async () => {
  try {
    await personStore.deleteAllPerson()
  } catch (error) {
    console.error('Failed to clear persons:', error)
  }
}

// Load initial data
onMounted(async () => {
  await checkHealth()
  await loadPersons()
})
</script>

<style scoped>
.postgresql-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
}

table {
  border-collapse: collapse;
}

.max-h-48 {
  max-height: 12rem;
}
</style>
