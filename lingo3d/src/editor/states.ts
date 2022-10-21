import hook from "./utils/hook"
import { setCameraList, getCameraList } from "../states/useCameraList"
import { getCameraStack, setCameraStack } from "../states/useCameraStack"
import {
    getCameraRendered,
    setCameraRendered
} from "../states/useCameraRendered"
import {
    setSelectionTarget,
    getSelectionTarget
} from "../states/useSelectionTarget"
import {
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
} from "../states/useMultipleSelectionTargets"
import {
    getEditorModeComputed,
    setEditorModeComputed
} from "../states/useEditorModeComputed"
import {
    getTransformControlsSpaceComputed,
    setTransformControlsSpaceComputed
} from "../states/useTransformControlsSpaceComputed"
import {
    setSelectionNativeTarget,
    getSelectionNativeTarget
} from "../states/useSelectionNativeTarget"
import {
    setSceneGraphExpanded,
    getSceneGraphExpanded
} from "../states/useSceneGraphExpanded"
import {
    getSelectionFrozen,
    setSelectionFrozen
} from "../states/useSelectionFrozen"
import { getFiles, setFiles } from "../states/useFiles"
import { setFileBrowser, getFileBrowser } from "../states/useFileBrowser"
import {
    setFileBrowserDir,
    getFileBrowserDir
} from "../states/useFileBrowserDir"
import { setFileSelected, getFileSelected } from "../states/useFileSelected"
import { setSetupStack, getSetupStack } from "../states/useSetupStack"
import { getStats, setStats } from "../states/useStats"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const useSelectionFrozen = hook(setSelectionFrozen, getSelectionFrozen)
export const useCameraList = hook(setCameraList, getCameraList)
export const useCameraStack = hook(setCameraStack, getCameraStack)
export const useCameraRendered = hook(setCameraRendered, getCameraRendered)
export const useEditorComputed = hook(
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
export const useSceneGraphExpanded = hook(
    setSceneGraphExpanded,
    getSceneGraphExpanded
)
export const useSetupStack = hook(setSetupStack, getSetupStack)
export const useFiles = hook(setFiles, getFiles)
export const useFileSelected = hook(setFileSelected, getFileSelected)
export const useFileBrowser = hook(setFileBrowser, getFileBrowser)
export const useFileBrowserDir = hook(setFileBrowserDir, getFileBrowserDir)
export const useStats = hook(setStats, getStats)
