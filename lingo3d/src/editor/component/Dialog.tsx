import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"
import prevent from "../utils/prevent"

interface DialogProps {
    showSignal?: Signal<boolean | undefined>
    children?: ComponentChildren
}

const Dialog = ({ showSignal, children }: DialogProps) => {
    if (!showSignal?.value) return null

    return createPortal(
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-absfull lingo3d-flexcenter"
            style={{ zIndex: 2 }}
            onContextMenu={prevent}
        >
            <div
                className="lingo3d-absfull"
                onMouseDown={() => (showSignal.value = undefined)}
            />
            <div
                className="lingo3d-bg-dark"
                style={{
                    padding: 6,
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
