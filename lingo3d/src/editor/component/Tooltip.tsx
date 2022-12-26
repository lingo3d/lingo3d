import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { Point } from "../.."
import { CONTEXT_MENU_ITEM_HEIGHT } from "../../globals"

type TooltipProps = {
    position?: Point
    children?: ComponentChildren
}

const Tooltip = ({ position, children }: TooltipProps) => {
    if (!position) return null

    const height =
        (Array.isArray(children) ? children.length : 1) *
            CONTEXT_MENU_ITEM_HEIGHT +
        16

    return createPortal(
        <div
            className="lingo3d-bg"
            style={{
                zIndex: 2,
                position: "absolute",
                left: position.x,
                top:
                    position.y + height > window.innerHeight
                        ? window.innerHeight - height
                        : position.y,
                padding: 6,
                border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
        >
            hello world
        </div>,
        document.body
    )
}

export default Tooltip
