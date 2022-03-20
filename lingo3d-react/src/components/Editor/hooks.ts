import { hook } from "@lincode/react-global-state"
import { setCamera, getCamera } from "lingo3d/lib/states/useCamera"
import { setCameraList, getCameraList } from "lingo3d/lib/states/useCameraList"
import { setSelectionTarget, getSelectionTarget } from "lingo3d/lib/states/useSelectionTarget"

export const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
export const useCamera = hook(setCamera, getCamera)
export const useCameraList = hook(setCameraList, getCameraList)