import { Point, quadrant } from "@lincode/math"
import { useMemo } from "preact/hooks"
import { stopPropagation } from "../utils/stopPropagation"

type BezierProps = {
    start?: Point
    end?: Point
    hoverOpacity?: number
    onMouseDown?: (e: MouseEvent) => void
    onContextMenu?: (e: MouseEvent) => void
    onMouseOver?: (e: MouseEvent) => void
    onMouseOut?: (e: MouseEvent) => void
}

const Bezier = ({
    start,
    end,
    hoverOpacity,
    onMouseDown,
    onContextMenu,
    onMouseOver,
    onMouseOut
}: BezierProps) => {
    const bezier = useMemo(() => {
        if (!start || !end) return

        const xMin = Math.min(start.x, end.x)
        const xMax = Math.max(start.x, end.x)
        const yMin = Math.min(start.y, end.y)
        const yMax = Math.max(start.y, end.y)

        const quad = quadrant(end.x, end.y, start.x, start.y)

        let x0 = 0
        let y0 = 0
        let x1 = 0
        let y1 = 0

        if (quad === 2) {
            x0 = 0
            y0 = 0
            x1 = xMax - xMin
            y1 = yMax - yMin
        } else if (quad === 3) {
            x0 = xMax - xMin
            y0 = 0
            x1 = 0
            y1 = yMax - yMin
        } else if (quad === 4) {
            x0 = xMax - xMin
            y0 = yMax - yMin
            x1 = 0
            y1 = 0
        } else if (quad === 1) {
            x0 = 0
            y0 = yMax - yMin
            x1 = xMax - xMin
            y1 = 0
        }

        return {
            xMin,
            xMax,
            yMin,
            yMax,
            width: xMax - xMin,
            height: yMax - yMin,
            x0,
            y0,
            x1,
            y1,
            startPoint: [x0, y0],
            endPoint: [x1, y1],
            controlPoint0: [x0 + (x1 - x0) * 0.5, y0],
            controlPoint1: [x0 + (x1 - x0) * 0.5, y1]
        }
    }, [start, end])

    if (!bezier) return null

    return (
        <svg
            ref={stopPropagation}
            style={{
                left: bezier.xMin,
                top: bezier.yMin,
                position: "absolute",
                pointerEvents: "none"
            }}
            width={bezier.width}
            height={bezier.height}
        >
            {hoverOpacity !== undefined && (
                <path
                    d={`M ${bezier.startPoint} C ${bezier.controlPoint0} ${bezier.controlPoint1} ${bezier.endPoint}`}
                    strokeWidth={10}
                    stroke="white"
                    strokeOpacity={hoverOpacity}
                    fill="none"
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onMouseDown={onMouseDown}
                    onContextMenu={onContextMenu}
                    style={{ pointerEvents: "auto" }}
                />
            )}
            <path
                d={`M ${bezier.startPoint} C ${bezier.controlPoint0} ${bezier.controlPoint1} ${bezier.endPoint}`}
                strokeWidth={1}
                stroke="white"
                fill="none"
            />
        </svg>
    )
}

export default Bezier
