import { Object3D } from "three"
import MeshAppendable from "../core/MeshAppendable"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"

export const getManager = (
    target: Object3D
): MeshAppendable | VisibleMixin | undefined => target.userData.manager

export const setManager = <T extends MeshAppendable>(
    target: Object3D,
    appendable: T
): T => (target.userData.manager ??= appendable)
