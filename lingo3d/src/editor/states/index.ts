import { setFiles, getFiles } from "../../states/useFiles"
import {
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
} from "../../states/useLoadingUnpkgCount"
import { setPaused, getPaused } from "../../states/usePaused"
import {
    setSelectionNativeTarget,
    getSelectionNativeTarget
} from "../../states/useSelectionNativeTarget"
import { setSetupStack, getSetupStack } from "../../states/useSetupStack"
import { setStats, getStats } from "../../states/useStats"
import hook from "../utils/hook"

export const useSelectionNativeTarget = hook(
    setSelectionNativeTarget,
    getSelectionNativeTarget
)
export const useSetupStack = hook(setSetupStack, getSetupStack)
export const usePaused = hook(setPaused, getPaused)
export const useStats = hook(setStats, getStats)
export const useLoadingUnpkgCount = hook(
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
)
export const useFiles = hook(setFiles, getFiles)
