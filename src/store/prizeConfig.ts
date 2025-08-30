import type { IPrizeConfig } from '@/types/storeType'
import { defineStore } from 'pinia'
import { defaultCurrentPrize, defaultPrizeList } from './data'

export const usePrizeConfig = defineStore('prize', {
  state() {
    return {
      prizeConfig: {
        prizeList: defaultPrizeList,
        currentPrize: defaultCurrentPrize,
        temporaryPrize: {
          id: '',
          name: '',
          sort: 0,
          isAll: false,
          count: 1,
          isUsedCount: 0,
          picture: {
            id: '-1',
            name: '',
            url: '',
          },
          separateCount: {
            enable: true,
            countList: [],
          },
          desc: '',
          isShow: false,
          isUsed: false,
          frequency: 1,
        } as IPrizeConfig,
      },
    }
  },
  getters: {
    // Get all configurations
    getPrizeConfigAll(state) {
      return state.prizeConfig
    },
    // Get prize list
    getPrizeConfig(state) {
      return state.prizeConfig.prizeList
    },
    // Get configuration by id
    getPrizeConfigById(state) {
      return (id: number | string) => {
        return state.prizeConfig.prizeList.find(item => item.id === id)
      }
    },
    // Get current prize
    getCurrentPrize(state) {
      return state.prizeConfig.currentPrize
    },
    // Get temporary prize
    getTemporaryPrize(state) {
      return state.prizeConfig.temporaryPrize
    },

  },
  actions: {
    // Set prize
    setPrizeConfig(prizeList: IPrizeConfig[]) {
      this.prizeConfig.prizeList = prizeList
    },
    // 添加奖项
    addPrizeConfig(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.prizeList.push(prizeConfigItem)
    },
    // 删除奖项
    deletePrizeConfig(prizeConfigItemId: number | string) {
      this.prizeConfig.prizeList = this.prizeConfig.prizeList.filter(item => item.id !== prizeConfigItemId)
    },
    // 更新奖项数据
    updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
      const prizeListLength = this.prizeConfig.prizeList.length
      if (prizeConfigItem.isUsed && prizeListLength) {
        for (let i = 0; i < prizeListLength; i++) {
          if (!this.prizeConfig.prizeList[i].isUsed) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i])
            break
          }
        }
      }
      else {
        return
      }
      this.resetTemporaryPrize()
    },
    // 删除全部奖项
    deleteAllPrizeConfig() {
      this.prizeConfig.prizeList = [] as IPrizeConfig[]
    },
    // 设置当前奖项
    setCurrentPrize(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.currentPrize = prizeConfigItem
    },
    // 设置临时奖项
    setTemporaryPrize(prizeItem: IPrizeConfig) {
      if (prizeItem.isShow === false) {
        for (let i = 0; i < this.prizeConfig.prizeList.length; i++) {
          if (this.prizeConfig.prizeList[i].isUsed === false) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i])

            break
          }
        }
        this.resetTemporaryPrize()

        return
      }

      this.prizeConfig.temporaryPrize = prizeItem
    },
    // 重置临时奖项
    resetTemporaryPrize() {
      this.prizeConfig.temporaryPrize = {
        id: '',
        name: '',
        sort: 0,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
          id: '-1',
          name: '',
          url: '',
        },
        separateCount: {
          enable: true,
          countList: [],
        },
        desc: '',
        isShow: false,
        isUsed: false,
        frequency: 1,
      } as IPrizeConfig
    },
    // 重置所有配置
    resetDefault() {
      this.prizeConfig = {
        prizeList: defaultPrizeList,
        currentPrize: defaultCurrentPrize,
        temporaryPrize: {
          id: '',
          name: '',
          sort: 0,
          isAll: false,
          count: 1,
          isUsedCount: 0,
          picture: {
            id: '-1',
            name: '',
            url: '',
          },
          separateCount: {
            enable: true,
            countList: [],
          },
          desc: '',
          isShow: false,
          isUsed: false,
          frequency: 1,
        } as IPrizeConfig,
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 如果要存储在localStorage中
        storage: localStorage,
        key: 'prizeConfig',
      },
    ],
  },
})
