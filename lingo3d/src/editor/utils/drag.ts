import ObjectManager from "../../display/core/ObjectManager"
import { container } from "../../engine/renderLoop/renderSetup"
import { setDragEvent } from "../../states/useDragEvent"

container.addEventListener("dragenter", (e) => e.preventDefault())
container.addEventListener("dragover", (e) => e.preventDefault())
container.addEventListener("dragleave", (e) => e.preventDefault())
container.addEventListener("drop", (e) => e.preventDefault())

export default <T>(onDrop: (draggingItem: T) => ObjectManager) => {
    let draggingItem: T | undefined
    container.addEventListener(
        "dragover",
        (e) => draggingItem && setDragEvent(e)
    )
    container.addEventListener("dragleave", () => setDragEvent(undefined))
    container.addEventListener(
        "drop",
        () => draggingItem && setDragEvent(() => onDrop(draggingItem!))
    )
    return (val: T | undefined) => (draggingItem = val)
}
