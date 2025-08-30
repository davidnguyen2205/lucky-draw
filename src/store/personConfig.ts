import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'

import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { defaultPersonList } from './data'
import { usePrizeConfig } from './prizeConfig'

export const usePersonConfig = defineStore('person', {
  state() {
    return {
      personConfig: {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      },
    }
  },
  getters: {
    // Get all configurations
    getPersonConfig(state) {
      return state.personConfig
    },
    // Get all personnel list
    getAllPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item
      })
    },
    // Get personnel list who haven't won this prize
    getNotThisPrizePersonList(state: any) {
      const currentPrize = usePrizeConfig().prizeConfig.currentPrize
      const data = state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return !item.prizeId.includes(currentPrize.id as string)
      })

      return data
    },
    // Get list of personnel who have won prizes
    getAlreadyPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item.isWin === true
      })
    },
    // Get details of personnel who won prizes
    getAlreadyPersonDetail(state) {
      return state.personConfig.alreadyPersonList
    },
    // Get list of personnel who haven't won prizes
    getNotPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item.isWin === false
      })
    },
  },
  actions: {
    // Add personnel who haven't won prizes
    addNotPersonList(personList: IPersonConfig[]) {
      if (personList.length <= 0) {
        return
      }
      personList.forEach((item: IPersonConfig) => {
        this.personConfig.allPersonList.push(item)
      })
    },
    // Add personnel who have won prizes
    addAlreadyPersonList(personList: IPersonConfig[], prize: IPrizeConfig | null) {
      if (personList.length <= 0) {
        return
      }
      personList.forEach((person: IPersonConfig) => {
        this.personConfig.allPersonList.map((item: IPersonConfig) => {
          if (item.id === person.id && prize != null) {
            item.isWin = true
            // person.isWin = true
            item.prizeName.push(prize.name)
            // person.prizeName += prize.name
            item.prizeTime.push(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            // person.prizeTime = new Date().toString()
            item.prizeId.push(prize.id as string)
          }

          return item
        })
        this.personConfig.alreadyPersonList.push(person)
      })
    },
    // Move from winners to non-winners
    moveAlreadyToNot(person: IPersonConfig) {
      if (person.id === undefined || person.id == null) {
        return
      }
      const alreadyPersonListLength = this.personConfig.alreadyPersonList.length
      for (let i = 0; i < this.personConfig.allPersonList.length; i++) {
        if (person.id === this.personConfig.allPersonList[i].id) {
          this.personConfig.allPersonList[i].isWin = false
          this.personConfig.allPersonList[i].prizeName = []
          this.personConfig.allPersonList[i].prizeTime = []
          this.personConfig.allPersonList[i].prizeId = []

          break
        }
      }
      for (let i = 0; i < alreadyPersonListLength; i++) {
        this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) =>
          item.id !== person.id,
        )
      }
    },
    // Delete specified personnel
    deletePerson(person: IPersonConfig) {
      if (person.id !== undefined || person.id != null) {
        this.personConfig.allPersonList = this.personConfig.allPersonList.filter((item: IPersonConfig) => item.id !== person.id)
        this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) => item.id !== person.id)
      }
    },
    // Delete all personnel
    deleteAllPerson() {
      this.personConfig.allPersonList = []
      this.personConfig.alreadyPersonList = []
    },

    // Reset all personnel  
    resetPerson() {
      this.personConfig.allPersonList = []
      this.personConfig.alreadyPersonList = []
    },
    // Reset personnel who have won prizes
    resetAlreadyPerson() {
      // Merge personnel who have won prizes into those who haven't, verify if they already exist
      this.personConfig.allPersonList.forEach((item: IPersonConfig) => {
        item.isWin = false
        item.prizeName = []
        item.prizeTime = []
        item.prizeId = []
      })
      this.personConfig.alreadyPersonList = []
    },
    setDefaultPersonList() {
      this.personConfig.allPersonList = defaultPersonList
      this.personConfig.alreadyPersonList = []
    },
    // Reset all configurations
    reset() {
      this.personConfig = {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // If you want to store in localStorage
        storage: localStorage,
        key: 'personConfig',
      },
    ],
  },
})
