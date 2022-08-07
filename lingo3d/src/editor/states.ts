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
import { setDefaultLight, getDefaultLight } from "../states/useDefaultLight"
import {
    setSceneGraphTarget,
    getSceneGraphTarget
} from "../states/useSceneGraphTarget"
import {
    setSceneGraphExpanded,
    getSceneGraphExpanded
} from "../states/useSceneGraphExpanded"
import {
    setSceneGraphPreventDrag,
    getSceneGraphPreventDrag
} from "../states/useSceneGraphPreventDrag"
import {
    getSelectionFrozen,
    setSelectionFrozen
} from "../states/useSelectionFrozen"
import { getNodeEditor, setNodeEditor } from "../states/useNodeEditor"
import { getDebug, setDebug } from "../states/useDebug"
import { getEditorMounted, setEditorMounted } from "../states/useEditorMounted"
import { getSetupStack, setSetupStack } from "../states/useSetupStack"

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
export const useDefaultLight = hook(setDefaultLight, getDefaultLight)
export const useSceneGraphTarget = hook(
    setSceneGraphTarget,
    getSceneGraphTarget
)
export const useSceneGraphExpanded = hook(
    setSceneGraphExpanded,
    getSceneGraphExpanded
)
export const useSceneGraphPreventDrag = hook(
    setSceneGraphPreventDrag,
    getSceneGraphPreventDrag
)
export const useNodeEditor = hook(setNodeEditor, getNodeEditor)
export const useDebug = hook(setDebug, getDebug)
export const useEditorMounted = hook(setEditorMounted, getEditorMounted)
export const useSetupStack = hook(setSetupStack, getSetupStack)
