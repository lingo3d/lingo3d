import { Object3D } from "three"
import Appendable from "../core/Appendable"

export const getManager = <T extends Appendable>(target: Object3D): T =>
    target.userData.manager

export const setManager = (target: Object3D, appendable: Appendable) =>
    (target.userData.manager ??= appendable)
