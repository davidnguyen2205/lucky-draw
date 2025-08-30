import request from './request'
import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'

// Session management
let sessionId: string | null = localStorage.getItem('session-id')

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('session-id', sessionId)
  }
  return sessionId
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Configure request headers
const apiRequest = {
  get: <T>(url: string) => request<T>({
    method: 'GET',
    url,
    headers: { 'X-Session-Id': getSessionId() }
  }),
  post: <T>(url: string, data?: any) => request<T>({
    method: 'POST',
    url,
    data,
    headers: { 'X-Session-Id': getSessionId() }
  }),
  put: <T>(url: string, data?: any) => request<T>({
    method: 'PUT',
    url,
    data,
    headers: { 'X-Session-Id': getSessionId() }
  }),
  delete: <T>(url: string) => request<T>({
    method: 'DELETE',
    url,
    headers: { 'X-Session-Id': getSessionId() }
  })
}

// Person API
export const personAPI = {
  // Get all persons
  getAll: () => apiRequest.get<{ success: boolean, data: IPersonConfig[] }>('/persons'),
  
  // Bulk import persons
  bulkImport: (persons: IPersonConfig[]) => 
    apiRequest.post<{ success: boolean, message: string }>('/persons/bulk', { persons }),
  
  // Update person
  update: (id: number, data: Partial<IPersonConfig>) =>
    apiRequest.put<{ success: boolean, data: IPersonConfig }>(`/persons/${id}`, data),
  
  // Delete person
  delete: (id: number) =>
    apiRequest.delete<{ success: boolean, message: string }>(`/persons/${id}`),
  
  // Reset lottery (clear all winners)
  resetLottery: () =>
    apiRequest.post<{ success: boolean, message: string }>('/persons/reset-lottery')
}

// Prize API
export const prizeAPI = {
  // Get all prizes
  getAll: () => apiRequest.get<{ success: boolean, data: IPrizeConfig[] }>('/prizes'),
  
  // Create or update prize
  save: (prize: IPrizeConfig) =>
    apiRequest.post<{ success: boolean, data: IPrizeConfig }>('/prizes', prize),
  
  // Update prize
  update: (id: string, data: Partial<IPrizeConfig>) =>
    apiRequest.put<{ success: boolean, data: IPrizeConfig }>(`/prizes/${id}`, data),
  
  // Delete prize
  delete: (id: string) =>
    apiRequest.delete<{ success: boolean, message: string }>(`/prizes/${id}`),
  
  // Reset all prizes
  resetAll: () =>
    apiRequest.post<{ success: boolean, message: string }>('/prizes/reset')
}

// Global Configuration API
export const configAPI = {
  // Get configuration
  get: (key: string) =>
    apiRequest.get<{ success: boolean, data: any }>(`/config/${key}`),
  
  // Save configuration
  save: (key: string, value: any) =>
    apiRequest.post<{ success: boolean, message: string }>(`/config/${key}`, { value })
}

// Health check
export const healthAPI = {
  check: () => apiRequest.get<{ status: string, timestamp: string, database: string }>('/health')
}
