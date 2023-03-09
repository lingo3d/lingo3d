import { Signal } from "@preact/signals"
import { GameGraphEditorPosition } from "."
import ContextMenu from "../component/ContextMenu"
import ContextMenuItem from "../component/ContextMenu/ContextMenuItem"

type GameGraphContextMenuProps = {
    positionSignal: Signal<GameGraphEditorPosition>
}

const GameGraphContextMenu = ({
    positionSignal
}: GameGraphContextMenuProps) => {
    return (
        <ContextMenu
            positionSignal={positionSignal}
            input={positionSignal.value?.create && "Node name"}
            onInput={(value) => {
                console.log(value)
            }}
        >
            <ContextMenuItem
                onClick={() => {
                    positionSignal.value = {
                        x: positionSignal.value?.x ?? 0,
                        y: positionSignal.value?.y ?? 0,
                        create: true
                    }
                }}
            >
                Create node
            </ContextMenuItem>
        </ContextMenu>
    )
}

export default GameGraphContextMenu
