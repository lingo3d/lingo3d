import deleteSelected from "../../../engine/hotkeys/deleteSelected"
import { getGameGraph } from "../../../states/useGameGraph"
import { getSelectionTarget } from "../../../states/useSelectionTarget"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import useSyncState from "../../hooks/useSyncState"
import nodeMenuSignal from "./nodeMenuSignal"

const NodeContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const gameGraph = useSyncState(getGameGraph)

    if (!gameGraph || !selectionTarget) return null

    return (
        <ContextMenu positionSignal={nodeMenuSignal}>
            {!gameGraph.children?.has(selectionTarget) && (
                <MenuButton
                    onClick={() => {
                        getGameGraph()!.deleteData(selectionTarget!.uuid)
                        nodeMenuSignal.value = undefined
                    }}
                >
                    Remove from GameGraph
                </MenuButton>
            )}
            <MenuButton
                onClick={() => {
                    deleteSelected()
                    nodeMenuSignal.value = undefined
                }}
            >
                Delete selected
            </MenuButton>
        </ContextMenu>
    )
}

export default NodeContextMenu
