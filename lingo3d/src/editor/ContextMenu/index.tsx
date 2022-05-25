import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import register from "preact-custom-element"
import { useEffect, useState } from "preact/hooks"
import { mouseEvents } from "../../api/mouse"
import { onSelectionTarget } from "../../events/onSelectionTarget"

preventTreeShake(h)

const ContextMenu = () => {
    const [pos, setPos] = useState<{ x: number, y: number } | undefined>(undefined)

    useEffect(() => {
        let [clientX, clientY] = [0, 0]
        const cb = (e: MouseEvent) => [clientX, clientY] = [e.clientX, e.clientY]
        document.addEventListener("mousemove", cb)

        const handle0 = mouseEvents.on("down", () => setPos(undefined))

        const handle = onSelectionTarget(({ target, rightClick }) => {
            rightClick && setPos({ x: clientX, y: clientY })
        })
        return () => {
            handle0.cancel()
            handle.cancel()
            document.removeEventListener("mousemove", cb)
        }
    }, [])

    if (!pos) return null

    return (
        <div
         className="lingo3d-ui"
         style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 9999, background: "rgb(40, 41, 46)", padding: 6 }}
        >
            <div style={{ padding: 6 }}>inspect</div>
            <div style={{ padding: 6 }}>show in SceneGraph</div>
        </div>
    )
}

register(ContextMenu, "lingo3d-contextmenu")