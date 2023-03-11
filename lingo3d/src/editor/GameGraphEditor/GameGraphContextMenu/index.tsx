import { rightClickPtr } from "../../../api/mouse"
import { GameObjectType } from "../../../api/serializer/types"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import gameGraphMenuSignal from "./gameGraphMenuSignal"

const GameGraphContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={gameGraphMenuSignal}
            input={
                gameGraphMenuSignal.value?.create && {
                    label: "Node name",
                    onInput: (value) => {
                        console.log(value)
                        console.log(gameGraphMenuSignal.value)
                    },
                    options: [
                        "incrementNode",
                        "mathNode",
                        "projectionNode",
                        "spawnNode",
                        "mouse",
                        "keyboard",
                        "joystick"
                    ] satisfies Array<GameObjectType>
                }
            }
        >
            <MenuButton
                onClick={() => {
                    gameGraphMenuSignal.value = {
                        x: gameGraphMenuSignal.value?.x ?? 0,
                        y: gameGraphMenuSignal.value?.y ?? 0,
                        create: true
                    }
                }}
            >
                Create node
            </MenuButton>
        </ContextMenu>
    )
}

export default GameGraphContextMenu
