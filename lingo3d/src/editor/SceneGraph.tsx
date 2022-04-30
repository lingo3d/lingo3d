import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"
import hook from "./hook"
import register from "preact-custom-element"

const SceneGraph = () => {
    return (
        <div style={{
             userSelect: "none",
             width: 350,
             maxHeight: "100%",
             overflowX: "hidden",
             overflowY: "scroll",
             float: "left"
        }}>
        </div>
    )
}

register(SceneGraph, "lingo3d-scenegraph");