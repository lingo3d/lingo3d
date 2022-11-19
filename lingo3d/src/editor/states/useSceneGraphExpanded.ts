import { Object3D } from "three"
import preactStore from "../utils/preactStore"

export const [useSceneGraphExpanded, setSceneGraphExpanded] = preactStore<
    Set<Object3D> | undefined
>(undefined)
