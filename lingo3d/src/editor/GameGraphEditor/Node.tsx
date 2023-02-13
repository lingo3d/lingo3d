import { event } from "@lincode/events"
import { Point } from "@lincode/math"
import { nanoid } from "nanoid"
import { memo, RefObject } from "preact/compat"
import { useEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { EDITOR_WIDTH } from "../../globals"
import { GameGraphNode } from "../../interface/IGameGraph"
import { getGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import unsafeGetValue from "../../utils/unsafeGetValue"
import SearchBox from "../component/SearchBox"
import treeContext from "../component/treeItems/treeContext"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"
import usePan from "../hooks/usePan"
import getDisplayName from "../utils/getDisplayName"
import Bezier from "./Bezier"

let panningUUID: string | undefined

type NodeProps = {
    uuid: string
    data: GameGraphNode
    getPositionRef: RefObject<
        (e: { clientX: number; clientY: number }) => Point
    >
    zoomRef: RefObject<number>
}

export const [emitNodeMove, onNodeMove] = event<string>()

const Node = memo(
    ({ uuid, data, getPositionRef, zoomRef }: NodeProps) => {
        const manager = useMemo(() => uuidMap.get(uuid), [uuid])
        const displayName = useMemo(
            () => manager && getDisplayName(manager),
            [manager]
        )
        const pressRef = usePan({
            onPan: (e) => {
                getGameGraph()!.mergeData({
                    [uuid]: {
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
        const [includeKeys, setIncludeKeys] = useState<Array<string>>([])
        const [connectedKeys, setConnectedKeys] = useState<Array<string>>([])
        const [bezierStart, setBezierStart] = useState<Point>()
        const [bezierEnd, setBezierEnd] = useState<Point>()

        useEffect(() => {
            if (!manager || !pane) return
            let size = 0
            const handle = addTargetInputs(
                pane,
                manager,
                [...includeKeys, ...connectedKeys],
                true,
                {
                    onDragStart: (e) => {
                        setBezierStart(getPositionRef.current!(e))
                        size = Object.keys(getGameGraphData()[0]!).length
                    },
                    onDrag: (e) => setBezierEnd(getPositionRef.current!(e)),
                    onDragEnd: (_, draggingItem) => {
                        setBezierStart(undefined)
                        setBezierEnd(undefined)
                        const _size = Object.keys(getGameGraphData()[0]!).length
                        _size > size &&
                            setConnectedKeys([
                                ...connectedKeys,
                                draggingItem.prop
                            ])
                    },
                    onDrop: (_, draggingItem, prop) => {
                        getGameGraph()!.mergeData({
                            [nanoid()]: {
                                from: draggingItem.manager.uuid,
                                fromProp: draggingItem.prop,
                                to: manager.uuid,
                                toProp: prop
                            }
                        })
                        setConnectedKeys([...connectedKeys, prop])
                    }
                }
            )
            return () => {
                handle.cancel()
            }
        }, [manager, includeKeys, connectedKeys, pane])

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
                        style={{ fontSize: 16, marginTop: -24 }}
                        ref={pressRef}
                    >
                        {displayName}
                    </div>
                    <SearchBox
                        fullWidth
                        style={{ marginTop: 8 }}
                        onChange={(val) => {
                            if (!val || !manager) {
                                setIncludeKeys([])
                                return
                            }
                            val = val.toLowerCase()
                            setIncludeKeys(
                                Object.keys(
                                    unsafeGetValue(manager, "constructor")
                                        .schema
                                ).filter((key) =>
                                    key.toLowerCase().includes(val)
                                )
                            )
                        }}
                    />
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
