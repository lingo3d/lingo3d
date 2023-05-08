import { memo } from "preact/compat"
import { useEffect, useLayoutEffect, useMemo, useState } from "preact/hooks"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Connector from "../../visualScripting/Connector"
import useSyncState from "../hooks/useSyncState"
import Bezier from "./Bezier"
import { onNodeMove } from "./Node"
import { getStagePosition } from "./Stage/stageSignals"
import { uuidMap } from "../../collections/idCollections"
import { toggleRightClick } from "../../engine/mouse"
import { forceGetInstance } from "@lincode/utils"
import { runtimeIncludeKeysMap } from "../../collections/runtimeCollections"

type ConnectionProps = {
    uuid: string
}

const formatFrom = (manager: Connector) =>
    `${manager.from} ${manager.fromProp}${manager.xyz ? `-${manager.xyz}` : ""}`

const Connection = memo(
    ({ uuid }: ConnectionProps) => {
        const [start, setStart] = useState({ x: 0, y: 0 })
        const [end, setEnd] = useState({ x: 0, y: 0 })
        const [refresh, setRefresh] = useState({})
        const manager = useMemo(() => uuidMap.get(uuid) as Connector, [])

        useLayoutEffect(() => {
            const { fromProp, toProp, from, to } = manager
            if (!fromProp || !toProp || !from || !to) return
            const fromManager = uuidMap.get(from)
            const toManager = uuidMap.get(to)
            if (!fromManager || !toManager) return
            forceGetInstance(runtimeIncludeKeysMap, fromManager, Set).add(
                fromProp
            )
            forceGetInstance(runtimeIncludeKeysMap, toManager, Set).add(toProp)
        }, [])

        useEffect(() => {
            //todo: refactor this with a map
            //todo: also other events like this one
            const handle = onNodeMove(
                (uuid) =>
                    (uuid === manager.from || uuid === manager.to) &&
                    setRefresh({})
            )
            return () => {
                handle.cancel()
            }
        }, [])

        useEffect(() => {
            let done = false
            queueMicrotask(() => {
                if (done) return

                const connectorFrom = unsafeGetValue(
                    window,
                    `${formatFrom(manager)} out`
                )
                const connectorTo = unsafeGetValue(
                    window,
                    manager.to + " " + manager.toProp + " in"
                )

                if (!connectorFrom || !connectorTo) return

                const boundsFrom = connectorFrom.getBoundingClientRect()
                const boundsTo = connectorTo.getBoundingClientRect()

                setStart(
                    getStagePosition(
                        boundsFrom.left + boundsFrom.width * 0.5,
                        boundsFrom.top + boundsFrom.height * 0.5
                    )
                )
                setEnd(
                    getStagePosition(
                        boundsTo.left + boundsTo.width * 0.5,
                        boundsTo.top + boundsTo.height * 0.5
                    )
                )
            })
            return () => {
                done = true
            }
        }, [refresh])

        const [over, setOver] = useState(false)
        const selectionTarget = useSyncState(getSelectionTarget)

        return (
            <Bezier
                start={start}
                end={end}
                hoverOpacity={
                    selectionTarget === manager ? 0.3 : over ? 0.2 : 0
                }
                onMouseOver={() => setOver(true)}
                onMouseOut={() => setOver(false)}
                onMouseDown={() => emitSelectionTarget(manager, true)}
                onContextMenu={(e) => {
                    toggleRightClick(e.clientX, e.clientY)
                    emitSelectionTarget(manager, true)
                }}
            />
        )
    },
    () => true
)

export default Connection
