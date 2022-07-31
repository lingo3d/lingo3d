import PositionedItem, { isPositionedItem } from "../../api/core/PositionedItem"
import ObjectManager from "./ObjectManager"
import StaticObjectManager from "./StaticObjectManager"

type MeshItem = PositionedItem | StaticObjectManager | ObjectManager
export default MeshItem

export const isMeshItem = (item: any): item is MeshItem =>
    !!item && (isPositionedItem(item) || item instanceof StaticObjectManager)