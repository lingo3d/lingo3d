import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import useInit from "../utils/useInit"

preventTreeShake(h)

interface ContextMenuProps {
    data?: { x: number; y: number }
    setData: (value: any) => void
    children?: JSX.Element | Array<JSX.Element>
}

const ContextMenu = ({ data, setData, children }: ContextMenuProps) => {    
    const elRef = useInit()

    if (!data) return null

    return (
        <div
            ref={elRef}
            className="lingo3d-ui"
            onMouseDown={() => setData(undefined)}
            style={{
                zIndex: 2,
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }}
        >
            <div
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
