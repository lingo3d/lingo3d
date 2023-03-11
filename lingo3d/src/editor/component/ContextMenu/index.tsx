import { Point } from "@lincode/math"
import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { CONTEXT_MENU_ITEM_HEIGHT } from "../../../globals"
import { stopPropagation } from "../../utils/stopPropagation"
import TextOptionsInput from "../TextOptionsInput"

interface ContextMenuProps {
    positionSignal?: Signal<Point | undefined>
    children?: ComponentChildren
    input?: string | false
    onInput?: (val: string) => void
}

const ContextMenu = ({
    positionSignal,
    children,
    input,
    onInput
}: ContextMenuProps) => {
    if (!positionSignal?.value) return null

    const height =
        (Array.isArray(children) ? children.length : 1) *
            CONTEXT_MENU_ITEM_HEIGHT +
        16

    return createPortal(
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-absfull"
            style={{ zIndex: 2 }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                className="lingo3d-absfull"
                onMouseDown={() => (positionSignal.value = undefined)}
            />
            <div
                className="lingo3d-bg"
                style={{
                    position: "absolute",
                    left: positionSignal.value.x,
                    top:
                        positionSignal.value.y + height > window.innerHeight
                            ? window.innerHeight - height
                            : positionSignal.value.y,
                    padding: 6,
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                {input ? (
                    <TextOptionsInput
                        autoFocus
                        style={{ padding: 6 }}
                        placeholder={input}
                        onEnter={(value) => {
                            onInput?.(value)
                            positionSignal.value = undefined
                        }}
                        onEscape={() => (positionSignal.value = undefined)}
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
