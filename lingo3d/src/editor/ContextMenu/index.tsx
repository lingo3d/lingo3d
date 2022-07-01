import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import { useState, useEffect } from "preact/hooks"

preventTreeShake(h)

interface ContextMenuProps {
    data?: { x: number, y: number }
    children?: JSX.Element | Array<JSX.Element>
}

const ContextMenu = ({ data, children }: ContextMenuProps) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(!!data)
    }, [data])

    if (!show || !data) return null
    
    return (
        <div
            className="lingo3d-ui"
            onMouseDown={() => setShow(false)}
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
