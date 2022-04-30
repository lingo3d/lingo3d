import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { onSceneChange } from "../events/onSceneChange"
import { appendableRoot } from "../api/core/Appendable"

preventTreeShake(h)

const SceneGraph = () => {
    const [r, render] = useState({})

    useEffect(() => {
        const handle = onSceneChange(() => render({}))
        return () => {
            handle.cancel()
        }
    }, [])

    const tree = useMemo(() => {
        for (const child of appendableRoot) {
            console.log(child)
        }

    }, [r])

    return (
        <div style={{
             userSelect: "none",
             width: 250,
             height: "100%",
             overflowX: "hidden",
             overflowY: "scroll",
             float: "left",
             background: "rgb(40, 41, 46)"
        }}>
            
        </div>
    )
}

register(SceneGraph, "lingo3d-scenegraph")