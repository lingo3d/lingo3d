import hook from "./utils/hook"
import { setCameraList, getCameraList } from "../states/useCameraList"
import {
    setSelectionTarget,
    getSelectionTarget
} from "../states/useSelectionTarget"
import {
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
} from "../states/useMultipleSelectionTargets"
import {
    getTransformControlsModeComputed,
    setTransformControlsModeComputed
} from "../states/useTransformControlsModeComputed"
import {
    getTransformControlsSpaceComputed,
    setTransformControlsSpaceComputed
} from "../states/useTransformControlsSpaceComputed"
import { getCameraStack, setCameraStack } from "../states/useCameraStack"
import { setDefaultLight, getDefaultLight } from "../states/useDefaultLight"
import { setDefaultFog, getDefaultFog } from "../states/useDefaultFog"
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
import { getEditorActive, setEditorActive } from "../states/useEditorActive"
import { getNodeEditor, setNodeEditor } from "../states/useNodeEditor"
import { getDebug, setDebug } from "../states/useDebug"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const useSelectionFrozen = hook(setSelectionFrozen, getSelectionFrozen)
export const useCameraList = hook(setCameraList, getCameraList)
export const useCameraStack = hook(setCameraStack, getCameraStack)
export const useTransformControlsModeComputed = hook(
    setTransformControlsModeComputed,
    getTransformControlsModeComputed
)
export const useTransformControlsSpaceComputed = hook(
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
)
export const useDefaultLight = hook(setDefaultLight, getDefaultLight)
export const useDefaultFog = hook(setDefaultFog, getDefaultFog)
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
export const useEditorActive = hook(setEditorActive, getEditorActive)
export const useNodeEditor = hook(setNodeEditor, getNodeEditor)
export const useDebug = hook(setDebug, getDebug)
