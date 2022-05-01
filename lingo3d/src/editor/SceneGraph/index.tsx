import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { onSceneChange } from "../../events/onSceneChange"
import Appendable, { appendableRoot } from "../../api/core/Appendable"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { useSelectionTarget } from "../states"

preventTreeShake(h)

type TreeItemProps = {
    appendable: Appendable
    level: number
}

const TreeItem = ({ appendable, level }: TreeItemProps) => {
    //@ts-ignore
    const { componentName } = appendable.constructor
    const appendableChildren = appendable.children ? [...appendable.children] : undefined
    const expandIconStyle = { opacity: appendableChildren?.length ? 0.5 : 0.05 }

    const [expanded, setExpanded] = useState(true)
    const [selectionTarget, setSelectionTarget] = useSelectionTarget()

    return (
        <div onClick={e => (e.stopPropagation(), setSelectionTarget(appendable))} style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontFamily: "arial",
            fontSize: 12,
            marginLeft: level * 18
        }}>
            <div style={{
                display: "flex",
                backgroundColor: selectionTarget === appendable ? "rgba(255, 255, 255, 0.1)" : undefined
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(false))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(true))} />
                )}
                <CubeIcon />
                {componentName}
            </div>
            {expanded && appendableChildren?.map(childAppendable => (
                <TreeItem key={childAppendable.uuid} appendable={childAppendable} level={level + 1} />
            ))}
        </div>
    )
}

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
        <div style={{
             userSelect: "none",
             width: 200,
             height: "100%",
             overflowX: "hidden",
             overflowY: "scroll",
             float: "left",
             background: "rgb(40, 41, 46)",
             padding: 10,
             boxSizing: "border-box"
        }}>
            <div style={{ width: 9999 }}>
                {appendables.map(appendable => (
                    <TreeItem key={appendable.uuid} appendable={appendable} level={0} />
                ))}
            </div>
        </div>
    )
}

register(SceneGraph, "lingo3d-scenegraph")