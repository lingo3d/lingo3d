import hook from "./hook"
import { setCameraList, getCameraList } from "../states/useCameraList"
import { setSelectionTarget, getSelectionTarget } from "../states/useSelectionTarget"
import { setMultipleSelectionTargets, getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getTransformControlsMode, setTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace, setTransformControlsSpace } from "../states/useTransformControlsSpace"
import { getCameraStack, setCameraStack } from "../states/useCameraStack"
import { setDefaultLight, getDefaultLight } from "../states/useDefaultLight"
import { setDefaultFog, getDefaultFog } from "../states/useDefaultFog"
import { setSceneGraphTarget, getSceneGraphTarget } from "../states/useSceneGraphTarget"
import { setSceneGraphExpanded, getSceneGraphExpanded } from "../states/useSceneGraphExpanded"
import { setSceneGraphPreventDrag, getSceneGraphPreventDrag } from "../states/useSceneGraphPreventDrag"
import { getSelectionFrozen, setSelectionFrozen } from "../states/useSelectionFrozen"
import { getEditorActive, setEditorActive } from "../states/useEditorActive"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const useSelectionFrozen = hook(setSelectionFrozen, getSelectionFrozen)
export const useCameraList = hook(setCameraList, getCameraList)
export const useCameraStack = hook(setCameraStack, getCameraStack)
export const useTransformControlsMode = hook(setTransformControlsMode, getTransformControlsMode)
export const useTransformControlsSpace = hook(setTransformControlsSpace, getTransformControlsSpace)
export const useDefaultLight = hook(setDefaultLight, getDefaultLight)
export const useDefaultFog = hook(setDefaultFog, getDefaultFog)
export const useSceneGraphTarget = hook(setSceneGraphTarget, getSceneGraphTarget)
export const useSceneGraphExpanded = hook(setSceneGraphExpanded, getSceneGraphExpanded)
export const useSceneGraphPreventDrag = hook(setSceneGraphPreventDrag, getSceneGraphPreventDrag)
export const useEditorActive = hook(setEditorActive, getEditorActive)