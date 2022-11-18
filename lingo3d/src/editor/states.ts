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
    getTransformControlsSpaceComputed,
    setTransformControlsSpaceComputed
} from "../states/useTransformControlsSpaceComputed"
import {
    setSelectionNativeTarget,
    getSelectionNativeTarget
} from "../states/useSelectionNativeTarget"
import {
    getSelectionFrozen,
    setSelectionFrozen
} from "../states/useSelectionFrozen"
import { getFiles, setFiles } from "../states/useFiles"
import { setSetupStack, getSetupStack } from "../states/useSetupStack"
import { getStats, setStats } from "../states/useStats"
import {
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
} from "../states/useLoadingUnpkgCount"
import { setFileCurrent, getFileCurrent } from "../states/useFileCurrent"
import { setPaused, getPaused } from "../states/usePaused"
import {
    getEditorModeComputed,
    setEditorModeComputed
} from "../states/useEditorModeComputed"
import { getTimeline, setTimeline } from "../states/useTimeline"
import preactStore from "./utils/preactStore"
import { Object3D } from "three"
import { FRAME_WIDTH } from "../globals"

export const useTimeline = hook(setTimeline, getTimeline)
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

export const [useSceneGraphExpanded, setSceneGraphExpanded] = preactStore<
    Set<Object3D> | undefined
>(undefined)
const [useTimelineScrollLeft, _setTimelineScrollLeft, getTimelineScrollLeft] =
    preactStore(0)
export { useTimelineScrollLeft }
export const addTimelineScrollLeft = (deltaX: number) =>
    _setTimelineScrollLeft(
        Math.min(
            Math.max(getTimelineScrollLeft() + deltaX, 0),
            getTimelineFrameNum() * FRAME_WIDTH - 520
        )
    )
export const [useTimelineFrameNum, , getTimelineFrameNum] = preactStore(1000)
const [
    useTimelineExpandedUUIDs,
    setTimelineExpandedUUIDs,
    getTimelineExpandedUUIDs
] = preactStore([new Set<string>()])
export { useTimelineExpandedUUIDs }
export const addTimelineExpandedUUID = (uuid: string) => {
    const [expandedUUIDs] = getTimelineExpandedUUIDs()
    expandedUUIDs.add(uuid)
    setTimelineExpandedUUIDs([expandedUUIDs])
}
export const deleteTimelineExpandedUUID = (uuid: string) => {
    const [expandedUUIDs] = getTimelineExpandedUUIDs()
    expandedUUIDs.delete(uuid)
    setTimelineExpandedUUIDs([expandedUUIDs])
}
export const [useTimelineSelectedFrame, setTimelineSelectedFrame] = preactStore<
    number | undefined
>(undefined)
export const [useTimelineSelectedLayer, setTimelineSelectedLayer] = preactStore<
    string | undefined
>(undefined)
export const [useFileSelected, setFileSelected] = preactStore<File | undefined>(
    undefined
)
export const [useFileBrowser, setFileBrowser] = preactStore(false)
export const [useFileBrowserDir] = preactStore("")
