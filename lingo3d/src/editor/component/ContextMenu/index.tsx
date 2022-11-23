import { Point } from "@lincode/math"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import useClickable from "../../utils/useClickable"

interface ContextMenuProps {
    position?: Point
    setPosition: (val: Point | undefined) => void
    children?: ComponentChildren
}

const ContextMenu = ({ position, setPosition, children }: ContextMenuProps) => {
    const elRef = useClickable()

    if (!position) return null

    return createPortal(
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-absfull"
            style={{ zIndex: 2 }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                className="lingo3d-absfull"
                onMouseDown={() => setPosition(undefined)}
            />
            <div
                className="lingo3d-bg"
                style={{
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    padding: 6,
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}
export default ContextMenu
