import { upperFirst } from "@lincode/utils"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import { container } from "../../engine/renderLoop/renderSetup"
import { setDragEvent } from "../../states/useDragEvent"

let draggingItem: string | undefined

container.addEventListener("dragenter", (e) => e.preventDefault())
container.addEventListener("dragover", (e) => {
    e.preventDefault()
    draggingItem && setDragEvent(e)
})
container.addEventListener("dragleave", (e) => {
    e.preventDefault()
    setDragEvent(undefined)
})
container.addEventListener("drop", (e) => {
    e.preventDefault()
    if (!draggingItem) return
    setDragEvent(() => createObject(draggingItem as GameObjectType))
})

type ObjectIconProps = {
    name: string
    iconName?: string
}

const img = document.createElement("img")

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
            draggable
            onDragStart={(e) => {
                draggingItem = name
                e.dataTransfer!.setDragImage(img, 0, 0)
            }}
            onDragEnd={() => (draggingItem = undefined)}
            style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20
            }}
        >
            <div
                style={{
                    width: 50,
                    height: 50,
                    backgroundImage: `url(https://unpkg.com/lingo3d-editor@1.0.3/assets/${iconName}.png)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />
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
