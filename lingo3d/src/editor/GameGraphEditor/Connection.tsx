import { Point } from "@lincode/math"
import { RefObject } from "preact"
import { memo } from "preact/compat"
import { useEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Connector from "../../visualScripting/Connector"
import Bezier from "./Bezier"
import { onNodeMove } from "./Node"

type ConnectionProps = {
    uuid: string
    getPositionRef: RefObject<
        (e: { clientX: number; clientY: number }) => Point
    >
}

const formatFrom = (data: Connector) =>
    `${data.from} ${data.fromProp}${data.xyz ? `-${data.xyz}` : ""}`

const Connection = memo(
    ({ uuid, getPositionRef }: ConnectionProps) => {
        const [start, setStart] = useState({ x: 0, y: 0 })
        const [end, setEnd] = useState({ x: 0, y: 0 })
        const [refresh, setRefresh] = useState({})
        const data = useMemo(() => uuidMap.get(uuid) as Connector, [])

        useEffect(() => {
            //todo: refactor this with a map
            //todo: also other events like this one
            const handle = onNodeMove(
                (uuid) =>
                    (uuid === data.from || uuid === data.to) && setRefresh({})
            )
            return () => {
                handle.cancel()
            }
        }, [])

        useEffect(() => {
            const connectorFrom = unsafeGetValue(
                window,
                `${formatFrom(data)} out`
            )
            const connectorTo = unsafeGetValue(
                window,
                data.to + " " + data.toProp + " in"
            )
            if (!connectorFrom || !connectorTo) return

            const boundsFrom = connectorFrom.getBoundingClientRect()
            const boundsTo = connectorTo.getBoundingClientRect()

            setStart(
                getPositionRef.current!({
                    clientX: boundsFrom.left + boundsFrom.width * 0.5,
                    clientY: boundsFrom.top + boundsFrom.height * 0.5
                })
            )
            setEnd(
                getPositionRef.current!({
                    clientX: boundsTo.left + boundsTo.width * 0.5,
                    clientY: boundsTo.top + boundsTo.height * 0.5
                })
            )
        }, [refresh])

        return <Bezier start={start} end={end} />
    },
    () => true
)

export default Connection
