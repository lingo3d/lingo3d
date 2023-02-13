import { Point } from "@lincode/math"
import { RefObject } from "preact"
import { useEffect, useState } from "preact/hooks"
import { GameGraphConnection } from "../../interface/IGameGraph"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Bezier from "./Bezier"

type ConnectionProps = {
    data: GameGraphConnection
    getPositionRef: RefObject<
        (e: { clientX: number; clientY: number }) => Point
    >
}

const Connection = ({ data, getPositionRef }: ConnectionProps) => {
    const [start, setStart] = useState({ x: 0, y: 0 })
    const [end, setEnd] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const connectorFrom = unsafeGetValue(
            window,
            data.from + " " + data.fromProp
        )
        const connectorTo = unsafeGetValue(window, data.to + " " + data.toProp)
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
    }, [])

    return <Bezier start={start} end={end} />
}

export default Connection
