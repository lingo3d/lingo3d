import { ComponentChildren } from "preact"
import { createPortal } from "preact/compat"
import useClickable from "../../utils/useClickable"

interface ContextMenuProps {
    data?: { x: number; y: number }
    setData: (value: any) => void
    children?: ComponentChildren
}

const ContextMenu = ({ data, setData, children }: ContextMenuProps) => {
    const elRef = useClickable()

    if (!data) return null

    return createPortal(
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-absfull"
            style={{ zIndex: 2 }}
        >
            <div
                className="lingo3d-absfull"
                onMouseDown={() => setData(undefined)}
            />
            <div
                className="lingo3d-bg"
                style={{
                    position: "absolute",
                    left: data.x,
                    top: data.y,
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
