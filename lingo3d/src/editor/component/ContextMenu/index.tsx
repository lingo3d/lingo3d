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
            className="lingo3d-ui"
            style={{
                zIndex: 2,
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            }}
        >
            <div
                onMouseDown={() => setData(undefined)}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%"
                }}
            />
            <div
                className="lingo3d-bg"
                style={{
                    position: "absolute",
                    left: data.x,
                    top: data.y,
                    padding: 6
                }}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}
export default ContextMenu
