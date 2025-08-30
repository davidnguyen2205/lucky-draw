import { useGlobalConfig } from './globalConfig'
import { usePersonConfig } from './personConfig'
import { usePersonConfigAPI } from './personConfigAPI'
import { usePrizeConfig } from './prizeConfig'
import { useSystem } from './system'

export default function useStore() {
  return {
    personConfig: usePersonConfig(),
    personConfigAPI: usePersonConfigAPI(), // New PostgreSQL-based store
    prizeConfig: usePrizeConfig(),
    globalConfig: useGlobalConfig(),
    system: useSystem(),
  }
}
