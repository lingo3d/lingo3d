import { Point } from "@lincode/math"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import useClickable from "../../utils/useClickable"

interface ContextMenuProps {
    position?: Point
    setPosition: (val: Point | undefined) => void
    children?: ComponentChildren
    input?: string
    inputPlaceholder?: string
    onInput?: (val: string) => void
}

const ContextMenu = ({
    position,
    setPosition,
    children,
    input,
    inputPlaceholder,
    onInput
}: ContextMenuProps) => {
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
                {input ? (
                    <input
                        ref={(el) => el?.focus()}
                        style={{ all: "unset", padding: 6 }}
                        placeholder={inputPlaceholder}
                        onKeyDown={(e) => {
                            e.stopPropagation()
                            if (e.key !== "Enter" && e.key !== "Escape") return
                            if (e.key === "Enter")
                                onInput?.((e.target as HTMLInputElement).value)
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
