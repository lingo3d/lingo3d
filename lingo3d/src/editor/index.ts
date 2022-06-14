import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import EventLoopItem from "../api/core/EventLoopItem"
import { Group } from "three"
import settings from "../api/settings"
import { appendableRoot } from "../api/core/Appendable"

const style = document.createElement("style")
document.head.appendChild(style)
style.innerHTML = `
    .lingo3d-ui * {
        user-select: none;
        -webkit-user-select: none;
        position: relative;
        box-sizing: border-box;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
    }
    .lingo3d-ui {
        position: relative;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: scroll;
        float: left;
        color: white;
        font-size: 11px;
    }
    .lingo3d-ui::-webkit-scrollbar {
        display: none;
    }
`

export default class LingoEditor extends EventLoopItem {
    public constructor() {
        super(new Group())
        appendableRoot.delete(this)

        this.createEffect(() => {
            settings.autoMount = "#lingo3d-world"

            const el = document.createElement("div")
            document.body.appendChild(el)
            el.style.cssText = "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; display: flex"

            el.innerHTML = `
                <lingo3d-toolbar></lingo3d-toolbar>
                <lingo3d-scenegraph></lingo3d-scenegraph>
                <lingo3d-editor></lingo3d-editor>
                <lingo3d-library></lingo3d-library>
                <div id="lingo3d-world" style="height: 100%; flex-grow: 1; position: relative"></div>
            `
            return () => {
                document.body.removeChild(el)
                settings.autoMount = false
            }
        }, [])
    }
}