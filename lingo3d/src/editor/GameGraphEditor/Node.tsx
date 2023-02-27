import { event } from "@lincode/events"
import { Point } from "@lincode/math"
import { memo, RefObject } from "preact/compat"
import { useEffect, useMemo, useState } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import { uuidMap } from "../../api/core/collections"
import { EDITOR_WIDTH } from "../../globals"
import { GameGraphNode } from "../../interface/IGameGraph"
import { getGameGraph } from "../../states/useGameGraph"
import Connector from "../../visualScripting/Connector"
import { getIncludeKeys } from "../../visualScripting/utils/getIncludeKeys"
import treeContext from "../component/treeItems/treeContext"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"
import usePan from "../hooks/usePan"
import getDisplayName from "../utils/getDisplayName"
import Bezier from "./Bezier"
import GearIcon from "./icons/GearIcon"

let panningUUID: string | undefined

type NodeProps = {
    uuid: string
    data: GameGraphNode
    getPositionRef: RefObject<
        (e: { clientX: number; clientY: number }) => Point
    >
    zoomRef: RefObject<number>
    onEdit?: (manager: Appendable) => void
}

export const [emitNodeMove, onNodeMove] = event<string>()

const Node = memo(
    ({ uuid, data, getPositionRef, zoomRef, onEdit }: NodeProps) => {
        const manager = useMemo(() => uuidMap.get(uuid), [uuid])
        const displayName = useMemo(
            () => manager && getDisplayName(manager),
            [manager]
        )
        const pressRef = usePan({
            onPan: (e) => {
                getGameGraph()!.mergeData({
                    [uuid]: {
                        type: "node",
                        x: data.x + e.deltaX / zoomRef.current!,
                        y: data.y + e.deltaY / zoomRef.current!
                    }
                })
                emitNodeMove(uuid)
            },
            onPanStart: () => (panningUUID = uuid),
            onPanEnd: () => (panningUUID = undefined)
        })
        const [pane, setContainer] = usePane()
        const [bezierStart, setBezierStart] = useState<Point>()
        const [bezierEnd, setBezierEnd] = useState<Point>()
        const [refresh, setRefresh] = useState({})

        useEffect(() => {
            if (!manager || !pane) return

            const handle0 = addTargetInputs(
                pane,
                manager,
                getIncludeKeys(manager),
                {
                    onDragStart: (e) =>
                        setBezierStart(getPositionRef.current!(e)),
                    onDrag: (e) => setBezierEnd(getPositionRef.current!(e)),
                    onDragEnd: () => {
                        setBezierStart(undefined)
                        setBezierEnd(undefined)
                    },
                    onDrop: (_, draggingItem, prop) => {
                        const connector = Object.assign(new Connector(), {
                            from: draggingItem.manager.uuid,
                            fromProp: draggingItem.prop,
                            to: manager.uuid,
                            toProp: prop,
                            xyz: draggingItem.xyz
                        })
                        const gameGraph = getGameGraph()!
                        gameGraph.append(connector)
                        gameGraph.mergeData({
                            [connector.uuid]: { type: "connector" }
                        })
                    }
                }
            )
            const handle1 = manager.propertyChangedEvent.on(
                "runtimeSchema",
                () => setRefresh({})
            )
            return () => {
                handle0.cancel()
                handle1.cancel()
            }
        }, [manager, pane, refresh])

        return (
            <>
                <div
                    style={{
                        width: EDITOR_WIDTH,
                        minHeight: 100,
                        position: "absolute",
                        left: data.x,
                        top: data.y
                    }}
                >
                    <div
                        style={{
                            fontSize: 16,
                            marginTop: -24,
                            display: "flex",
                            alignItems: "center"
                        }}
                        ref={pressRef}
                    >
                        <div style={{ zIndex: 1 }}>{displayName}</div>
                        <div
                            className="lingo3d-flexcenter"
                            style={{
                                padding: 4,
                                margin: 4,
                                background: "rgba(255, 255, 255, 0.1)",
                                zIndex: 1
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
                    <div ref={setContainer} style={{ width: "100%" }} />
                </div>
                <Bezier start={bezierStart} end={bezierEnd} />
            </>
        )
    },
    (prev) => {
        if (prev.uuid === panningUUID) return false
        if (!treeContext.draggingItem) return true
        return treeContext.draggingItem.uuid !== prev.uuid
    }
)
export default Node
