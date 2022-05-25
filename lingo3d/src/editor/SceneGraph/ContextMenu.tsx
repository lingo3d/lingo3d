import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import PositionedItem from "../../api/core/PositionedItem"
import { mouseEvents } from "../../api/mouse"
import { emitEditorSearch } from "../../events/onEditorSearch"
import { onSelectionTarget } from "../../events/onSelectionTarget"

preventTreeShake(h)

const ContextMenu = () => {
    const [data, setData] = useState<{ x: number, y: number, target: PositionedItem } | undefined>(undefined)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) => [clientX, clientY] = [e.clientX, e.clientY]
        document.addEventListener("mousemove", cb)

        const handle0 = mouseEvents.on("down", () => setData(undefined))

        const handle = onSelectionTarget(({ target, rightClick }) => {
            rightClick && target && setData({ x: clientX, y: clientY, target })
        })
        return () => {
            handle0.cancel()
            handle.cancel()
            document.removeEventListener("mousemove", cb)
        }
    }, [])

    if (!data) return null

    return (
        <div
         className="lingo3d-ui"
         style={{ position: "absolute", left: data.x, top: data.y, zIndex: 9999, background: "rgb(40, 41, 46)", padding: 6 }}
        >
            {showSearch ? (
                <input
                 ref={el => el?.focus()}
                 style={{ all: "unset", padding: 6 }}
                 onKeyDown={e => {
                     e.stopPropagation()
                     if (e.key !== "Enter" && e.key !== "Escape") return
                     e.key === "Enter" && emitEditorSearch((e.target as HTMLInputElement).value)
                     setShowSearch(false)
                     setData(undefined)
                 }}
                />
            ) : (
                <div style={{ padding: 6, whiteSpace: "nowrap" }} onClick={() => setShowSearch(true)}>
                    Search children
                </div>
            )}
            
        </div>
    )
}

export default ContextMenu