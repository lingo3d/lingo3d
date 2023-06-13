import store from "@lincode/reactivity"
import { Point3dType } from "../utils/isPoint"

export const [
    setTransformControlsSnapDirection,
    getTransformControlsSnapDirection
] = store<Point3dType | undefined>(undefined)
