import store from "@lincode/reactivity"
import { Camera } from "three"
import mainCamera from "../engine/mainCamera"

export const [setCamera, getCamera] = store<Camera>(mainCamera)