import { setCameraList, getCameraList } from "../states/useCameraList"
import { setSelectionTarget, getSelectionTarget } from "../states/useSelectionTarget"
import { setMultipleSelectionTargets, getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getTransformControlsMode, setTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace, setTransformControlsSpace } from "../states/useTransformControlsSpace"
import hook from "./hook"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useMultipleSelectionTargets = hook(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const useCameraList = hook(setCameraList, getCameraList)
export const useTransformControlsMode = hook(setTransformControlsMode, getTransformControlsMode)
export const useTransformControlsSpace = hook(setTransformControlsSpace, getTransformControlsSpace)