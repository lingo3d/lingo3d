import { Object3D } from "three"
import FoundManager from "../FoundManager"
import { getManager } from "./getManager"
import type Model from "../../Model"
import { getFoundManagerPtr } from "../../../pointers/getFoundManagerPtr"

export const getFoundManager = (child: Object3D, owner: Model) =>
    getManager<FoundManager>(child) ?? new FoundManager(child, owner)

getFoundManagerPtr[0] = getFoundManager
