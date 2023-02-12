import { Point } from "@lincode/math"
import { valueof } from "@lincode/utils"
import { memo, RefObject } from "preact/compat"
import { useEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { EDITOR_WIDTH } from "../../globals"
import { GameGraphData } from "../../interface/IGameGraph"
import unsafeGetValue from "../../utils/unsafeGetValue"
import SearchBox from "../component/SearchBox"
import treeContext from "../component/treeItems/treeContext"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"
import usePan, { PanEvent } from "../hooks/usePan"
import getDisplayName from "../utils/getDisplayName"

let panningUUID: string | undefined

type NodeProps = {
    uuid: string
    data: valueof<GameGraphData>
    onPan?: (e: PanEvent) => void
    getPositionRef: RefObject<(e: DragEvent) => Point>
}

const Node = memo(
    ({ uuid, data, onPan, getPositionRef }: NodeProps) => {
        const manager = useMemo(() => uuidMap.get(uuid), [uuid])
        const displayName = useMemo(
            () => manager && getDisplayName(manager),
            [manager]
        )
        const pressRef = usePan({
            onPan,
            onPanStart: () => (panningUUID = uuid),
            onPanEnd: () => (panningUUID = undefined)
        })
        const [pane, setContainer] = usePane()
        const [includeKeys, setIncludeKeys] = useState<Array<string>>([])
        const [bezierStart, setBezierStart] = useState<Point>()
        const [bezierEnd, setBezierEnd] = useState<Point>()

        const bezierBounds = useMemo(() => {
            if (!bezierStart || !bezierEnd) return
            return {
                xMin: Math.min(bezierStart.x, bezierEnd.x),
                xMax: Math.max(bezierStart.x, bezierEnd.x),
                yMin: Math.min(bezierStart.y, bezierEnd.y),
                yMax: Math.max(bezierStart.y, bezierEnd.y)
            }
        }, [bezierStart, bezierEnd])

        useEffect(() => {
            if (!manager || !pane) return
            const handle = addTargetInputs(pane, manager, includeKeys, true, {
                onDragStart: (e) => setBezierStart(getPositionRef.current!(e)),
                onDrag: (e) => setBezierEnd(getPositionRef.current!(e)),
                onDragEnd: (e) => {
                    // setBezierStart(undefined)
                    // setBezierEnd(undefined)
                },
                onDrop: (e, draggingItem) => {}
            })
            return () => {
                handle.cancel()
            }
        }, [manager, includeKeys, pane])

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
                {bezierBounds && (
                    <svg
                        style={{
                            left: bezierBounds.xMin,
                            top: bezierBounds.yMin,
                            position: "absolute",
                            pointerEvents: "none",
                            background: "yellow"
                        }}
                        width={bezierBounds.xMax - bezierBounds.xMin}
                        height={bezierBounds.yMax - bezierBounds.yMin}
                    />
                )}
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
