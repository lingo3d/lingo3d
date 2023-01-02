import PositionedManager, { isPositionedManager } from "./PositionedManager"
import ObjectManager from "./ObjectManager"
import StaticObjectManager from "./StaticObjectManager"
import VisibleObjectManager from "./VisibleObjectManager"

type MeshManager =
    | PositionedManager
    | StaticObjectManager
    | ObjectManager
    | VisibleObjectManager
export default MeshManager

export const isMeshManager = (item: any): item is MeshManager =>
    isPositionedManager(item) || item instanceof StaticObjectManager
