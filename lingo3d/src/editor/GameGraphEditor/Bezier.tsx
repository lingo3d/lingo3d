import { Point, quadrant } from "@lincode/math"
import { useMemo } from "preact/hooks"

type BezierProps = {
    bezierStart?: Point
    bezierEnd?: Point
}

const Bezier = ({ bezierStart, bezierEnd }: BezierProps) => {
    const bezier = useMemo(() => {
        if (!bezierStart || !bezierEnd) return

        const xMin = Math.min(bezierStart.x, bezierEnd.x)
        const xMax = Math.max(bezierStart.x, bezierEnd.x)
        const yMin = Math.min(bezierStart.y, bezierEnd.y)
        const yMax = Math.max(bezierStart.y, bezierEnd.y)

        const quad = quadrant(
            bezierEnd.x,
            bezierEnd.y,
            bezierStart.x,
            bezierStart.y
        )

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
    }, [bezierStart, bezierEnd])

    if (!bezier) return null

    return (
        <svg
            style={{
                left: bezier.xMin,
                top: bezier.yMin,
                position: "absolute",
                pointerEvents: "none"
            }}
            width={bezier.width}
            height={bezier.height}
        >
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
