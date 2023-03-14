import createObject from "../../../api/serializer/createObject"
import { GameObjectType } from "../../../api/serializer/types"
import { getGameGraph } from "../../../states/useGameGraph"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import { getStagePosition } from "../Stage/stageSignals"
import stageMenuSignal from "./stageMenuSignal"

const StageContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={stageMenuSignal}
            input={
                stageMenuSignal.value?.create && {
                    label: "Node name",
                    onInput: (value) => {
                        const gameGraph = getGameGraph()!
                        const manager = createObject(value as GameObjectType)
                        gameGraph.append(manager)
                        const { x, y } = stageMenuSignal.value!
                        gameGraph.mergeData({
                            [manager.uuid]: {
                                type: "node",
                                ...getStagePosition(x, y)
                            }
                        })
                    },
                    options: [
                        "mathNode",
                        "numberNode",
                        "addNode",
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
                    stageMenuSignal.value = {
                        x: stageMenuSignal.value?.x ?? 0,
                        y: stageMenuSignal.value?.y ?? 0,
                        create: true
                    }
                }}
            >
                Create node
            </MenuButton>
        </ContextMenu>
    )
}

export default StageContextMenu
