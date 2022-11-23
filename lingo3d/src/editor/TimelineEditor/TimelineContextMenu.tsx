import { Point } from "@lincode/math"
import { useState } from "preact/hooks"
import ContextMenu from "../component/ContextMenu"

const TimelineContextMenu = () => {
    const [position, setPosition] = useState<Point>()

    return <ContextMenu position={position} setPosition={setPosition} />
}

export default TimelineContextMenu
