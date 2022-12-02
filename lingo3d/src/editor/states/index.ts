import { setSetupStack, getSetupStack } from "../../states/useSetupStack"
import { setStats, getStats } from "../../states/useStats"
import hook from "../utils/hook"


export const useSetupStack = hook(setSetupStack, getSetupStack)
export const useStats = hook(setStats, getStats)
