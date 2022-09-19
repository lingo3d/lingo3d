import TexturedBasicMixin from "../../display/core/mixins/TexturedBasicMixin"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import ObjectManager from "../../display/core/ObjectManager"
import { container } from "../../engine/renderLoop/renderSetup"
import { setDragEvent } from "../../states/useDragEvent"

container.addEventListener("dragenter", (e) => e.preventDefault())
container.addEventListener("dragover", (e) => e.preventDefault())
container.addEventListener("dragleave", (e) => e.preventDefault())
container.addEventListener("drop", (e) => e.preventDefault())
document.addEventListener("drop", (e) => e.preventDefault())

export default <T>(
    onDrop: (
        draggingItem: T,
        hitManager?: ObjectManager | TexturedBasicMixin | TexturedStandardMixin
    ) => ObjectManager | undefined
) => {
    let draggingItem: T | undefined
    container.addEventListener(
        "dragover",
        (e) => draggingItem && setDragEvent(e)
    )
    container.addEventListener("dragleave", () => setDragEvent(undefined))
    container.addEventListener(
        "drop",
        () =>
            draggingItem &&
            setDragEvent((hitManager) => onDrop(draggingItem!, hitManager))
    )
    return (val: T | undefined) => (draggingItem = val)
}

export const dragImage = document.createElement("img")
