import { event } from "@lincode/events"
import { Point } from "@lincode/math"
import { memo } from "preact/compat"
import { useEffect, useMemo, useState } from "preact/hooks"
import Appendable from "../../display/core/Appendable"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { GameGraphNode } from "../../interface/IGameGraph"
import { getGameGraph } from "../../states/useGameGraph"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import SpawnNode from "../../visualScripting/SpawnNode"
import { getIncludeKeys } from "../../visualScripting/utils/getIncludeKeys"
import { ConnectionDraggingItem, initConnectorIn } from "../Editor/addInputs"
import addTargetInputs from "../Editor/addTargetInputs"
import { getOriginalInstance } from "../Editor/createParams"
import usePane from "../Editor/usePane"
import mergeRefs from "../hooks/mergeRefs"
import usePan from "../hooks/usePan"
import useSyncState from "../hooks/useSyncState"
import getDisplayName from "../utils/getDisplayName"
import { stopPropagation } from "../utils/stopPropagation"
import Bezier from "./Bezier"
import GearIcon from "./icons/GearIcon"
import { nodeContexMenuSignal } from "./NodeContextMenu"
import { getStagePosition, zoomSignal } from "./Stage/stageSignals"
import convertToTemplateNodes from "./utils/convertToTemplateNodes"
import createConnector from "./utils/createConnector"
import { uuidMap } from "../../collections/idCollections"
import { draggingItemPtr } from "../../pointers/draggingItemPtr"
import { editorWidthSignal } from "../signals/sizeSignals"

let panningUUID: string | undefined

type Props = {
    uuid: string
    data: GameGraphNode
    onEdit?: (manager: Appendable) => void
}

export const [emitNodeMove, onNodeMove] = event<string>()

const Node = memo(
    ({ uuid, data, onEdit }: Props) => {
        const manager = useMemo(() => uuidMap.get(uuid)!, [])
        const displayName = useMemo(() => getDisplayName(manager), [])
        const pressRef = usePan({
            onPan: (e) => {
                getGameGraph()!.mergeData({
                    [uuid]: {
                        type: "node",
                        x: data.x + e.deltaX / zoomSignal.value,
                        y: data.y + e.deltaY / zoomSignal.value
                    }
                })
                emitNodeMove(uuid)
            },
            onPanStart: () => {
                panningUUID = uuid
                emitSelectionTarget(manager, true)
            },
            onPanEnd: () => (panningUUID = undefined)
        })
        const [pane, setContainer] = usePane()
        const [bezierStart, setBezierStart] = useState<Point>()
        const [bezierEnd, setBezierEnd] = useState<Point>()
        const [refresh, setRefresh] = useState({})
        const selectionTarget = useSyncState(getSelectionTarget)

        const [initConnector, onDrop] = useMemo(() => {
            const onDrop = (
                _: DragEvent,
                draggingItem: ConnectionDraggingItem,
                prop: string
            ) => {
                if (
                    getOriginalInstance(draggingItem.manager) instanceof
                    SpawnNode
                ) {
                    createConnector(
                        draggingItem.manager,
                        draggingItem.prop,
                        convertToTemplateNodes(manager, draggingItem.manager),
                        prop,
                        draggingItem.xyz
                    )
                    return
                }
                createConnector(
                    draggingItem.manager,
                    draggingItem.prop,
                    manager,
                    prop,
                    draggingItem.xyz
                )
            }
            const initConnector = (el: HTMLDivElement | null) =>
                el && initConnectorIn(el, "uuid", { onDrop })

            return [initConnector, onDrop] as const
        }, [])

        useEffect(() => {
            if (!pane) return

            const handle0 = addTargetInputs(
                pane,
                manager,
                getIncludeKeys(manager),
                {
                    onDragStart: (e) =>
                        setBezierStart(getStagePosition(e.clientX, e.clientY)),
                    onDrag: (e) =>
                        setBezierEnd(getStagePosition(e.clientX, e.clientY)),
                    onDragEnd: () => {
                        setBezierStart(undefined)
                        setBezierEnd(undefined)
                    },
                    onDrop
                }
            )
            const handle1 = manager.$events.on("runtimeSchema", () =>
                setRefresh({})
            )
            return () => {
                handle0.cancel()
                handle1.cancel()
            }
        }, [pane, refresh])

        const handleContextMenu = (e: MouseEvent) => {
            nodeContexMenuSignal.value = new Point(e.clientX, e.clientY)
            emitSelectionTarget(manager, true)
        }

        return (
            <>
                <div
                    style={{
                        width: editorWidthSignal.value + 10,
                        position: "absolute",
                        left: data.x,
                        top: data.y,
                        outline:
                            selectionTarget === manager
                                ? "1px solid white"
                                : undefined
                    }}
                >
                    <div
                        style={{
                            fontSize: 16,
                            marginTop: -24,
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <div
                            className="lingo3d-flexcenter lingo3d-connector"
                            id={manager.uuid + " uuid in"}
                            ref={initConnector}
                        >
                            <div
                                className="lingo3d-connector-child"
                                style={{ border: "1px solid white" }}
                            />
                        </div>
                        <div
                            style={{ zIndex: 1 }}
                            ref={pressRef}
                            onContextMenu={handleContextMenu}
                        >
                            {displayName}
                        </div>
                        <div
                            className="lingo3d-flexcenter"
                            style={{
                                padding: 4,
                                margin: 4,
                                background: "rgba(255, 255, 255, 0.1)",
                                zIndex: 1,
                                cursor: "pointer"
                            }}
                            onClick={
                                onEdit && manager
                                    ? () => onEdit(manager)
                                    : undefined
                            }
                        >
                            <GearIcon />
                        </div>
                    </div>
                    <div
                        ref={mergeRefs(setContainer, stopPropagation)}
                        style={{ width: "100%" }}
                        onMouseDown={() => emitSelectionTarget(manager, true)}
                        onContextMenu={handleContextMenu}
                    />
                </div>
                <Bezier start={bezierStart} end={bezierEnd} />
            </>
        )
    },
    (prev) => {
        if (prev.uuid === panningUUID) return false
        if (!draggingItemPtr[0]) return true
        return draggingItemPtr[0].uuid !== prev.uuid
    }
)
export default Node
