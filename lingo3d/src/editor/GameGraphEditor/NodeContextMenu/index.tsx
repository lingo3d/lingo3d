import { getSelectionTarget } from "../../../states/useSelectionTarget"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import useSyncState from "../../hooks/useSyncState"
import nodeMenuSignal from "./nodeMenuSignal"

const NodeContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)

    return (
        <ContextMenu positionSignal={nodeMenuSignal}>
            <MenuButton
                onClick={() => {
                    selectionTarget?.dispose()
                    nodeMenuSignal.value = undefined
                }}
            >
                Delete node
            </MenuButton>
        </ContextMenu>
    )
}

export default NodeContextMenu
