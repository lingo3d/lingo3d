import { memo } from "preact/compat"
import { sceneGraphContextMenuSignal } from ".."
import { componentNameMenuButtonMap } from "../../../../collections/componentNameMenuButtonMap"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"
import MenuButton from "../../../component/MenuButton"
import { timelinePtr } from "../../../../pointers/timelinePtr"
import { setTimeline } from "../../../../states/useTimeline"

componentNameMenuButtonMap.set(
    "timeline",
    memo(
        () => {
            const selectionTarget = selectionTargetPtr[0] as any
            const [timeline] = timelinePtr

            return (
                <MenuButton
                    disabled={selectionTarget === timeline}
                    onClick={() => {
                        setTimeline(selectionTarget)
                        sceneGraphContextMenuSignal.value = undefined
                    }}
                >
                    {selectionTarget === timeline
                        ? "Already editing"
                        : "Edit Timeline"}
                </MenuButton>
            )
        },
        () => true
    )
)
