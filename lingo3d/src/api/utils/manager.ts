import { Object3D } from "three"
import MeshAppendable from "../core/MeshAppendable"

export const getManager = <T extends MeshAppendable>(target: Object3D): T =>
    target.userData.manager

export const setManager = (target: Object3D, appendable: MeshAppendable) =>
    (target.userData.manager ??= appendable)
