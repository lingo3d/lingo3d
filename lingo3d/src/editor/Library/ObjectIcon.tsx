import { preventTreeShake, upperFirst } from "@lincode/utils"
import { h } from "preact"
import clientToWorld from "../../display/utils/clientToWorld"
import createObject from "../../display/utils/serializer/createObject"
import { GameObjectType } from "../../display/utils/serializer/types"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getSelection } from "../../states/useSelection"

preventTreeShake(h)

let draggingItem: string | undefined

container.addEventListener("dragover", e => e.preventDefault())
container.addEventListener("dragenter", e => e.preventDefault())
container.addEventListener("drop", e => {
    if (!draggingItem || !getSelection()) return
    const manager = createObject(draggingItem as GameObjectType)
    const { x, y, z } = clientToWorld(e, true)
    manager.outerObject3d.position.set(x, y, z)
    emitSelectionTarget(manager)
})

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
         onDragStart={() => draggingItem = name}
         onDragEnd={() => draggingItem = undefined}
         style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
         }}
        >
            <img style={{ width: 50 }} src={`https://unpkg.com/lingo3d-editor@1.0.1/assets/${iconName}.png`} />
            <div style={{ marginTop: 6, opacity: 0.75, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                {upperFirst(name)}
            </div>
        </div>
    )
}

export default ObjectIcon