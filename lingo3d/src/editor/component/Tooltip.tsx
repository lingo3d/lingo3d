import { createPortal } from "preact/compat"
import { PointType } from "../../typeGuards/isPoint"

type TooltipProps = {
    position?: PointType
}

const Tooltip = ({ position }: TooltipProps) => {
    if (!position) return null

    const height = 13

    return createPortal(
        <div
            className="lingo3d-ui"
            style={{
                zIndex: 2,
                position: "absolute",
                left: position.x,
                top:
                    position.y + height > window.innerHeight
                        ? window.innerHeight - height
                        : position.y,

                pointerEvents: "none"
            }}
        >
            <div className="lingo3d-bg" style={{ marginLeft: 50 }}>
                hello world
            </div>
        </div>,
        document.body
    )
}

export default Tooltip
