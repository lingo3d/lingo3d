import { memo } from "preact/compat"
import { sceneGraphContextMenuSignal } from ".."
import { componentNameMenuButtonMap } from "../../../../collections/componentNameMenuButtonMap"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"
import { getScript, setScript } from "../../../../states/useScript"
import MenuButton from "../../../component/MenuButton"

componentNameMenuButtonMap.set(
    "script",
    memo(
        () => {
            const selectionTarget = selectionTargetPtr[0] as any
            const script = getScript()

            return (
                <MenuButton
                    disabled={selectionTarget === script}
                    onClick={() => {
                        setScript(selectionTarget)
                        sceneGraphContextMenuSignal.value = undefined
                    }}
                >
                    {selectionTarget === script
                        ? "Already editing"
                        : "Edit Script"}
                </MenuButton>
            )
        },
        () => true
    )
)
