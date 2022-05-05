import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { onSceneChange } from "../../events/onSceneChange"
import { appendableRoot } from "../../api/core/Appendable"
import TreeItem from "./TreeItem"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"

preventTreeShake(h)

const SceneGraph = () => {
    const [r, render] = useState({})

    useEffect(() => {
        const handle = onSceneChange(() => render({}))
        return () => {
            handle.cancel()
        }
    }, [])

    const appendables = useMemo(() => [...appendableRoot], [r])

    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 200,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 4,
             paddingTop: 12
         }}
        >
            <div style={{ width: 9999 }}>
                {appendables.map(appendable => (
                    appendable instanceof Model ? (
                        <ModelTreeItem appendable={appendable} level={0} />
                    ) : (
                        <TreeItem key={appendable.uuid} appendable={appendable} level={0} />
                    )
                ))}
            </div>
        </div>
    )
}

register(SceneGraph, "lingo3d-scenegraph")