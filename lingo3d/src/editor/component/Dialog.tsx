import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"
import prevent from "../utils/prevent"

interface DialogProps {
    signal?: Signal<any>
    children?: ComponentChildren
}

const Dialog = ({ signal, children }: DialogProps) => {
    if (!signal?.value) return null

    return createPortal(
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-absfull lingo3d-flexcenter"
            style={{ zIndex: 2 }}
            onContextMenu={prevent}
        >
            <div
                className="lingo3d-absfull"
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
                onMouseDown={() => (signal.value = undefined)}
            />
            <div
                className="lingo3d-bg-dark"
                style={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    minWidth: 300,
                    minHeight: 200
                }}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}
export default Dialog
