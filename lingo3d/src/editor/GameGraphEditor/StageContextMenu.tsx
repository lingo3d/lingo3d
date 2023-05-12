import { Point } from "@lincode/math"
import { Signal, signal } from "@preact/signals"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import { getGameGraph } from "../../states/useGameGraph"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import { getStagePosition } from "./Stage/stageSignals"
import diffSceneGraph from "../../api/undoStack/diffSceneGraph"

export const stageContextMenuSignal: Signal<
    (Point & { create?: boolean }) | undefined
> = signal(undefined)

const StageContextMenu = () => {
    return (
        <ContextMenu
            positionSignal={stageContextMenuSignal}
            input={
                stageContextMenuSignal.value?.create && {
                    label: "Node name",
                    onInput: (value) => {
                        const gameGraph = getGameGraph()!
                        const manager = createObject(value as GameObjectType)
                        gameGraph.append(manager)
                        const { x, y } = stageContextMenuSignal.value!
                        gameGraph.mergeData({
                            [manager.uuid]: {
                                type: "node",
                                ...getStagePosition(x, y)
                            }
                        })
                        diffSceneGraph()
                    },
                    options: [
                        "mathNode",
                        "numberNode",
                        "addNode",
                        "projectionNode",
                        "spawnNode",
                        "loopNode",
                        "mouse",
                        "keyboard",
                        "joystick"
                    ] satisfies Array<GameObjectType>
                }
            }
        >
            <MenuButton
                onClick={() => {
                    stageContextMenuSignal.value = {
                        x: stageContextMenuSignal.value?.x ?? 0,
                        y: stageContextMenuSignal.value?.y ?? 0,
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
