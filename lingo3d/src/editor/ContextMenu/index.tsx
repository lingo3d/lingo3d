import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import useInit from "../utils/useInit";

preventTreeShake(h)

interface ContextMenuProps {
    data?: { x: number; y: number }
    setData: (value: any) => void
    children?: JSX.Element | Array<JSX.Element>
}

const ContextMenu = ({ data, setData, children }: ContextMenuProps) => {
    if (!data) return null
    const elRef = useInit()

    return (
        <div
            ref={elRef}
            className="lingo3d-ui"
            onMouseDown={() => setData(undefined)}
            style={{
                zIndex: 9999,
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    position: "absolute",
                    left: data.x,
                    top: data.y,
                    background: "rgb(40, 41, 46)",
                    padding: 6
                }}
            >
                {children}
            </div>
        </div>
    )
}
export default ContextMenu
