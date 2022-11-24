import { setCameraList, getCameraList } from "../../states/useCameraList"
import {
    setCameraRendered,
    getCameraRendered
} from "../../states/useCameraRendered"
import { setCameraStack, getCameraStack } from "../../states/useCameraStack"
import {
    setEditorModeComputed,
    getEditorModeComputed
} from "../../states/useEditorModeComputed"
import { setFileCurrent, getFileCurrent } from "../../states/useFileCurrent"
import { setFiles, getFiles } from "../../states/useFiles"
import {
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
} from "../../states/useLoadingUnpkgCount"
import {
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"
import { setPaused, getPaused } from "../../states/usePaused"
import {
    setSelectionFrozen,
    getSelectionFrozen
} from "../../states/useSelectionFrozen"
import {
    setSelectionNativeTarget,
    getSelectionNativeTarget
} from "../../states/useSelectionNativeTarget"
import {
    setSelectionTarget,
    getSelectionTarget
} from "../../states/useSelectionTarget"
import { setSetupStack, getSetupStack } from "../../states/useSetupStack"
import { setStats, getStats } from "../../states/useStats"
import {
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
} from "../../states/useTransformControlsSpaceComputed"
import hook from "../utils/hook"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const useSelectionFrozen = hook(setSelectionFrozen, getSelectionFrozen)
export const useCameraList = hook(setCameraList, getCameraList)
export const useCameraStack = hook(setCameraStack, getCameraStack)
export const useCameraRendered = hook(setCameraRendered, getCameraRendered)
export const useEditorModeComputed = hook(
    setEditorModeComputed,
    getEditorModeComputed
)
export const useTransformControlsSpaceComputed = hook(
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
)
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
export const useFileCurrent = hook(setFileCurrent, getFileCurrent)
