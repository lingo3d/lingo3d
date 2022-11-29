import { Point } from "@lincode/math"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { CONTEXT_MENU_ITEM_HEIGHT } from "../../../globals"
import useClickable from "../../hooks/useClickable"

interface ContextMenuProps {
    position?: Point
    setPosition: (val: Point | undefined) => void
    children?: ComponentChildren
    input?: string | false
    onInput?: (val: string) => void
}

const ContextMenu = ({
    position,
    setPosition,
    children,
    input,
    onInput
}: ContextMenuProps) => {
    const elRef = useClickable()

    if (!position) return null

    const height =
        (Array.isArray(children) ? children.length : 1) *
            CONTEXT_MENU_ITEM_HEIGHT +
        16

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
                    top:
                        position.y + height > window.innerHeight
                            ? window.innerHeight - height
                            : position.y,
                    padding: 6,
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                {input ? (
                    <input
                        ref={(el) => setTimeout(() => el?.focus())}
                        style={{ all: "unset", padding: 6 }}
                        placeholder={input}
                        onKeyDown={(e) => {
                            e.stopPropagation()
                            if (e.key !== "Enter" && e.key !== "Escape") return
                            e.key === "Enter" &&
                                onInput?.(e.currentTarget.value)
                            setPosition(undefined)
                        }}
                    />
                ) : (
                    children
                )}
            </div>
        </div>,
        document.body
    )
}
export default ContextMenu
