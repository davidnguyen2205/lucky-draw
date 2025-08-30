import { defineStore } from 'pinia'
import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'
import { personAPI } from '@/api/services'
import { defaultPersonList } from './data'

export const usePersonConfigAPI = defineStore('personAPI', {
  state() {
    return {
      personConfig: {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      },
      isLoading: false,
      error: null as string | null
    }
  },
  getters: {
    // Get all configurations
    getPersonConfig(state) {
      return state.personConfig
    },
    // Get all personnel list
    getAllPersonList(state) {
      return state.personConfig.allPersonList
    },
    // Get personnel list who haven't won this prize
    getNotThisPrizePersonList(state: any) {
      return (prizeId: string) => {
        return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
          return !item.prizeId.includes(prizeId)
        })
      }
    },
    // Get list of personnel who have won prizes
    getAlreadyPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => item.isWin)
    },
    // Get details of personnel who won prizes
    getAlreadyPersonDetail(state) {
      return state.personConfig.alreadyPersonList
    },
    // Get list of personnel who haven't won prizes
    getNotPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => !item.isWin)
    },
  },
  actions: {
    // Load persons from API
    async loadPersons() {
      this.isLoading = true
      this.error = null
      try {
        const response = await personAPI.getAll()
        if (response.success) {
          this.personConfig.allPersonList = response.data
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load persons'
        console.error('Error loading persons:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Add personnel who haven't won prizes
    async addNotPersonList(personList: IPersonConfig[]) {
      try {
        const response = await personAPI.bulkImport(personList)
        if (response.success) {
          await this.loadPersons() // Reload from server
        }
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to import persons'
        throw error
      }
    },

    // Add personnel who have won prizes
    async addAlreadyPersonList(personList: IPersonConfig[], prize: IPrizeConfig | null) {
      try {
        const updates = personList.map(async (person) => {
          const updatedPerson = {
            ...person,
            isWin: true,
            prizeName: prize ? [...person.prizeName, prize.name] : person.prizeName,
            prizeTime: prize ? [...person.prizeTime, new Date().toISOString()] : person.prizeTime,
            prizeId: prize ? [...person.prizeId, prize.id] : person.prizeId,
          }
          
          return personAPI.update(person.id, updatedPerson)
        })

        await Promise.all(updates)
        await this.loadPersons() // Reload from server
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update winners'
        throw error
      }
    },

    // Move from winners to non-winners
    async moveAlreadyToNot(person: IPersonConfig) {
      try {
        const updatedPerson = {
          ...person,
          isWin: false,
          prizeName: [],
          prizeTime: [],
          prizeId: [],
        }

        await personAPI.update(person.id, updatedPerson)
        await this.loadPersons() // Reload from server
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to move person'
        throw error
      }
    },

    // Delete specified personnel
    async deletePerson(person: IPersonConfig) {
      try {
        await personAPI.delete(person.id)
        await this.loadPersons() // Reload from server
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete person'
        throw error
      }
    },

    // Delete all personnel
    async deleteAllPerson() {
      try {
        await personAPI.bulkImport([]) // Empty import = delete all
        this.personConfig.allPersonList = []
        this.personConfig.alreadyPersonList = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete all persons'
        throw error
      }
    },

    // Reset all personnel
    async resetPerson() {
      this.personConfig.allPersonList = []
      this.personConfig.alreadyPersonList = []
    },

    // Reset personnel who have won prizes
    async resetAlreadyPerson() {
      try {
        await personAPI.resetLottery()
        await this.loadPersons() // Reload from server
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to reset lottery'
        throw error
      }
    },

    // Set default person list
    async setDefaultPersonList() {
      try {
        await this.addNotPersonList(defaultPersonList)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to set default persons'
        throw error
      }
    },

    // Reset all configurations
    async reset() {
      this.personConfig = {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      }
      this.error = null
    },
  },
})
