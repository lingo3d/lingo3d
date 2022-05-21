import hook from "./hook"
import { setCameraList, getCameraList } from "../states/useCameraList"
import { setSelectionTarget, getSelectionTarget } from "../states/useSelectionTarget"
import { setMultipleSelectionTargets, getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getTransformControlsMode, setTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace, setTransformControlsSpace } from "../states/useTransformControlsSpace"
import { getCamera, setCamera } from "../states/useCamera"
import { setDefaultLight, getDefaultLight } from "../states/useDefaultLight"
import { setDefaultFog, getDefaultFog } from "../states/useDefaultFog"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const useCameraList = hook(setCameraList, getCameraList)
export const useCamera = hook(setCamera, getCamera)
export const useTransformControlsMode = hook(setTransformControlsMode, getTransformControlsMode)
export const useTransformControlsSpace = hook(setTransformControlsSpace, getTransformControlsSpace)
export const useDefaultLight = hook(setDefaultLight, getDefaultLight)
export const useDefaultFog = hook(setDefaultFog, getDefaultFog)