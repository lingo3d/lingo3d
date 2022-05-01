import { setCameraList, getCameraList } from "../states/useCameraList"
import { setSelectionTarget, getSelectionTarget } from "../states/useSelectionTarget"
import hook from "./hook"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useCameraList = hook(setCameraList, getCameraList)