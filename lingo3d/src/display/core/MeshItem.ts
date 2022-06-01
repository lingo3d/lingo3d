import PositionedItem, { isPositionedItem } from "../../api/core/PositionedItem"
import StaticObjectManager from "./StaticObjectManager"

type MeshItem = PositionedItem | StaticObjectManager
export default MeshItem

export const isMeshItem = (item: any): item is MeshItem => !!item && (isPositionedItem(item) || item instanceof StaticObjectManager)