import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"
import hook from "./hook"
import register from "preact-custom-element"

const SceneGraph = () => {
    return (
        <div style="display: inline-block; user-select:none;">hello world</div>
    )
}

register(SceneGraph, "lingo3d-scenegraph");