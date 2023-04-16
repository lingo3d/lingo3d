import { Object3D } from "three"
import FoundManager from "../../display/core/FoundManager"
import { getManager } from "./getManager"
import type Model from "../../display/Model"

export const getFoundManager = (child: Object3D, parentManager: Model) =>
    (getManager(child) ??
        new FoundManager(child, parentManager)) as FoundManager
