import { Point } from "@lincode/math"
import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { CONTEXT_MENU_ITEM_HEIGHT } from "../../../globals"
import mergeRefs from "../../hooks/mergeRefs"
import { stopPropagation } from "../../utils/stopPropagation"

const setFocus = (el: HTMLInputElement | null) => setTimeout(() => el?.focus())

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
                    <input
                        ref={mergeRefs(setFocus, stopPropagation)}
                        style={{ all: "unset", padding: 6 }}
                        placeholder={input}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter" && e.key !== "Escape") return
                            e.key === "Enter" &&
                                onInput?.(e.currentTarget.value)
                            positionSignal.value = undefined
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
