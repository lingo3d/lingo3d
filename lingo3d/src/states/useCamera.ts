import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import mainCamera from "../engine/mainCamera"

export const [setCamera, getCamera] = store<PerspectiveCamera>(mainCamera)