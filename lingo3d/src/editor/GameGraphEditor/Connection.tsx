import { Point } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { RefObject } from "preact"
import { memo } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import Connector from "../../visualScripting/Connector"
import { GameGraphConnection } from "../../interface/IGameGraph"
import { getGameGraph } from "../../states/useGameGraph"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Bezier from "./Bezier"
import { onNodeMove } from "./Node"

type ConnectionProps = {
    data: GameGraphConnection
    getPositionRef: RefObject<
        (e: { clientX: number; clientY: number }) => Point
    >
}

const connectorMap = new Map<string, Connector>()

const Connection = memo(
    ({ data, getPositionRef }: ConnectionProps) => {
        const [start, setStart] = useState({ x: 0, y: 0 })
        const [end, setEnd] = useState({ x: 0, y: 0 })
        const [refresh, setRefresh] = useState({})

        useEffect(() => {
            forceGet(
                connectorMap,
                `${data.from} ${data.fromProp} ${data.to} ${data.toProp}`,
                () => {
                    const connector = new Connector()
                    Object.assign(connector, data)
                    getGameGraph()!.append(connector)
                    return connector
                }
            )
        }, [])

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
                `${data.from} ${data.fromProp}${
                    data.xyz ? `-${data.xyz}` : ""
                } out`
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
