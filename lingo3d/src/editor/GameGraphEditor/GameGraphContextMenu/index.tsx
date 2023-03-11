import createObject from "../../../api/serializer/createObject"
import { GameObjectType } from "../../../api/serializer/types"
import { getGameGraph } from "../../../states/useGameGraph"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import { getStagePosition } from "../Stage/stageSignals"
import gameGraphMenuSignal from "./gameGraphMenuSignal"

const GameGraphContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={gameGraphMenuSignal}
            input={
                gameGraphMenuSignal.value?.create && {
                    label: "Node name",
                    onInput: (value) => {
                        const gameGraph = getGameGraph()!
                        const manager = createObject(value as GameObjectType)
                        gameGraph.append(manager)
                        const { x, y } = gameGraphMenuSignal.value!
                        gameGraph.mergeData({
                            [manager.uuid]: {
                                type: "node",
                                ...getStagePosition(x, y)
                            }
                        })
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
