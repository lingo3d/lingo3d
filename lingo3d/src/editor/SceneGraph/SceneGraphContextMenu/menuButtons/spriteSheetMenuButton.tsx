import { memo } from "preact/compat"
import { sceneGraphContextMenuSignal } from ".."
import { componentNameMenuButtonMap } from "../../../../collections/componentNameMenuButtonMap"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"
import MenuButton from "../../../component/MenuButton"
import downloadBlob from "../../../../utils/downloadBlob"
import { returnTrue } from "../../../../display/utils/reusables"

componentNameMenuButtonMap.set(
    "spriteSheet",
    memo(() => {
        const selectionTarget = selectionTargetPtr[0] as any
        return (
            <MenuButton
                onClick={() => {
                    downloadBlob("spriteSheet.png", selectionTarget.toBlob())
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Save image
            </MenuButton>
        )
    }, returnTrue)
)
