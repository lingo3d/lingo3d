import Appendable from "../../api/core/Appendable"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { container } from "../../engine/renderLoop/containers"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import { setEditorDragEvent } from "../../states/useEditorDragEvent"

container.addEventListener("dragenter", (e) => e.preventDefault())
container.addEventListener("dragover", (e) => e.preventDefault())
container.addEventListener("dragleave", (e) => e.preventDefault())
container.addEventListener("drop", (e) => e.preventDefault())
document.addEventListener("drop", (e) => e.preventDefault())

export default <T>(
    onDrop: (
        draggingItem: T,
        hitManager?: Appendable | TexturedStandardMixin
    ) => Appendable | undefined
) => {
    let draggingItem: T | undefined
    container.addEventListener(
        "dragover",
        (e) => draggingItem && !draggingItemPtr[0] && setEditorDragEvent(e)
    )
    container.addEventListener("dragleave", () => setEditorDragEvent(undefined))
    container.addEventListener(
        "drop",
        () =>
            draggingItem &&
            !draggingItemPtr[0] &&
            setEditorDragEvent((hitManager) =>
                onDrop(draggingItem!, hitManager)
            )
    )
    return (val: T | undefined) => (draggingItem = val)
}

const dragImage = document.createElement("img")
dragImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAANpJREFUWEftV0EOwjAMs98FV25sz4BnAM+Ab2w3rvCuoKAWTUVrqm2oTEqPdeVZietmROXFyt+HC1hPBURkA2AXPHMn+Rz6x8LHvFZUARHZA+gSkpbke8/Cc0YvFXAFcEiIbiSPQUAWX0LAGcApIbqQ1H2tQBZfQoD2/5EQbaMPQv9H8dkCBn1uAlkf+x/JRUQx9YqujmRfEnJFHighmnpmPQKse27hv8iBJvbZc8BzIOSE58CkLCoOIuueW3iNHPjkxOzHSER8Hvi7eeDrvfd5YFIIAP5rVr8CLzMRtCGSCwBVAAAAAElFTkSuQmCC"
dragImage.width = 0
dragImage.height = 0

export const setDragImage = (e: DragEvent) =>
    e.dataTransfer!.setDragImage(dragImage, 0, 0)
