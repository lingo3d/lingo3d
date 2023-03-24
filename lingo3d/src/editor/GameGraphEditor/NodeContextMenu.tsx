import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import deleteSelected from "../../engine/hotkeys/deleteSelected"
import { getGameGraph } from "../../states/useGameGraph"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import useSyncState from "../hooks/useSyncState"

export const nodeContexMenuSignal: Signal<Point | undefined> = signal(undefined)

const NodeContextMenu = () => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const gameGraph = useSyncState(getGameGraph)

    if (!gameGraph || !selectionTarget) return null

    return (
        <ContextMenu positionSignal={nodeContexMenuSignal}>
            {!gameGraph.children?.has(selectionTarget) && (
                <MenuButton
                    onClick={() => {
                        getGameGraph()!.deleteData(selectionTarget!.uuid)
                        nodeContexMenuSignal.value = undefined
                    }}
                >
                    Remove from GameGraph
                </MenuButton>
            )}
            <MenuButton
                onClick={() => {
                    deleteSelected()
                    nodeContexMenuSignal.value = undefined
                }}
            >
                Delete selected
            </MenuButton>
        </ContextMenu>
    )
}

export default NodeContextMenu
