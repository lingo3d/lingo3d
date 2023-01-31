import { Object3D } from "three"
import MeshAppendable from "../core/MeshAppendable"

export const getManager = <T extends MeshAppendable>(
    target: Object3D
): T | undefined => target.userData.manager

export const setManager = <T extends MeshAppendable>(
    target: Object3D,
    appendable: T
): T => (target.userData.manager ??= appendable)
