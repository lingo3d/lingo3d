import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"
import { createPortal, useLayoutEffect, useRef, useState } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"
import TextOptionsInput from "./TextOptionsInput"
import prevent from "../utils/prevent"
import { PointType } from "../../typeGuards/isPoint"

interface ContextMenuProps {
    positionSignal?: Signal<PointType | undefined>
    children?: ComponentChildren
    input?:
        | {
              label?: string
              onInput?: (val: string) => void
              options?: Array<string>
          }
        | false
}

const ContextMenu = ({ positionSignal, children, input }: ContextMenuProps) => {
    if (!positionSignal?.value) return null

    const elRef = useRef<HTMLDivElement>(null)
    const [xOverFlow, setXOverFlow] = useState(false)
    const [yOverFlow, setYOverFlow] = useState(false)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el || !positionSignal.value) return

        setXOverFlow(
            positionSignal.value.x + el.offsetWidth > window.innerWidth
        )
        setYOverFlow(
            positionSignal.value.y + el.offsetHeight > window.innerHeight
        )
    }, [])

    return createPortal(
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-absfull"
            style={{ zIndex: 2 }}
            onContextMenu={prevent}
        >
            <div
                className="lingo3d-absfull"
                onMouseDown={() => (positionSignal.value = undefined)}
            />
            <div
                ref={elRef}
                className="lingo3d-bg-dark"
                style={{
                    position: "absolute",
                    left: xOverFlow ? undefined : positionSignal.value.x,
                    right: xOverFlow ? 0 : undefined,
                    top: yOverFlow ? undefined : positionSignal.value.y,
                    bottom: yOverFlow ? 0 : undefined,
                    padding: 6,
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                {input ? (
                    <TextOptionsInput
                        autoFocus
                        style={{ padding: 6 }}
                        placeholder={input.label}
                        options={input.options}
                        onEnter={(value) => {
                            input.onInput?.(value)
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
