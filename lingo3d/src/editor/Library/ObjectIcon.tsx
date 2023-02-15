import { upperFirst } from "@lincode/utils"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import GameGraph from "../../visualScripting/GameGraph"
import SpotLight from "../../display/lights/SpotLight"
import { setGameGraph } from "../../states/useGameGraph"
import drag, { setDragImage } from "../utils/drag"
import IconImage from "./IconImage"

const setDraggingItem = drag<GameObjectType>((val) => {
    const result = createObject(val)
    if (result instanceof SpotLight) {
        queueMicrotask(() => {
            result.targetX = result.x
            result.targetY = result.y - 100
            result.targetZ = result.z
        })
    } else if (result instanceof GameGraph) setGameGraph(result)
    return result
})

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
            draggable
            onDragStart={(e) => {
                setDraggingItem(name as GameObjectType)
                setDragImage(e)
            }}
            onDragEnd={() => setDraggingItem(undefined)}
            className="lingo3d-flexcenter lingo3d-flexcol"
            style={{ width: "50%", paddingTop: 20, paddingBottom: 20 }}
        >
            <IconImage iconName={iconName} />
            <div
                style={{
                    marginTop: 6,
                    opacity: 0.75,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%"
                }}
            >
                {upperFirst(name)}
            </div>
        </div>
    )
}

export default ObjectIcon
