import store from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"

export const [setSelectionEnabled, getSelectionEnabled] = store(true)

getCameraRendered((cam) => setSelectionEnabled(cam === mainCamera))
