import PositionedManager, { isPositionedManager } from "../../api/core/PositionedManager"
import ObjectManager from "./ObjectManager"
import StaticObjectManager from "./StaticObjectManager"
import VisibleObjectManager from "./VisibleObjectManager"

type MeshItem =
    | PositionedManager
    | StaticObjectManager
    | ObjectManager
    | VisibleObjectManager
export default MeshItem

export const isMeshItem = (item: any): item is MeshItem =>
    !!item && (isPositionedManager(item) || item instanceof StaticObjectManager)
