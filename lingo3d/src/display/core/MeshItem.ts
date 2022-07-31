import PositionedItem, { isPositionedItem } from "../../api/core/PositionedItem"
import ObjectManager from "./ObjectManager"
import StaticObjectManager from "./StaticObjectManager"

type MeshItem = PositionedItem | StaticObjectManager | ObjectManager
export default MeshItem

export const isMeshItem = (item: any): item is MeshItem =>
    !!item && (isPositionedItem(item) || item instanceof StaticObjectManager)

export const getObject3d = (item: MeshItem) => {
    if ("object3d" in item) return item.object3d
    return item.outerObject3d
}
