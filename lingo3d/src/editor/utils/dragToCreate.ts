import { createEffect } from "@lincode/reactivity"
import Appendable from "../../display/core/Appendable"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { container } from "../../engine/renderLoop/containers"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import { setEditorDragEvent } from "../../states/useEditorDragEvent"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import prevent from "./prevent"
import { editorBehaviorPtr } from "../../pointers/editorBehaviorPtr"

createEffect(() => {
    if (!editorBehaviorPtr[0]) return
    container.addEventListener("dragenter", prevent)
    container.addEventListener("dragover", prevent)
    container.addEventListener("dragleave", prevent)
    container.addEventListener("drop", prevent)
    document.addEventListener("drop", prevent)
    return () => {
        container.removeEventListener("dragenter", prevent)
        container.removeEventListener("dragover", prevent)
        container.removeEventListener("dragleave", prevent)
        container.removeEventListener("drop", prevent)
        document.removeEventListener("drop", prevent)
    }
}, [getEditorBehavior])

export default <T>(
    onDrop: (
        draggingItem: T,
        hitManager: Appendable | TexturedStandardMixin | undefined,
        e: DragEvent
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
        (e) =>
            draggingItem &&
            !draggingItemPtr[0] &&
            setEditorDragEvent((hitManager) =>
                onDrop(draggingItem!, hitManager, e)
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
