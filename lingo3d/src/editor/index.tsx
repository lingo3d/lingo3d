import "./Editor"
import "./NodeEditor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import settings from "../api/settings"
import { Disposable } from "@lincode/promiselikes"
import createElement from "../utils/createElement"

const style = createElement(`
    <style>
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
            max-height: 100%;
        }
        .lingo3d-ui::-webkit-scrollbar {
            display: none;
        }
        .lingo3d-bg {
            background: rgb(40, 41, 46);
        }
        .tp-lblv_l {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tp-rotv {
            box-shadow: none !important;
            background-color: transparent !important;
        }
        .tp-brkv {
            border-left: none !important;
        }
    </style>
`)
document.head.appendChild(style)

export default class LingoEditor extends Disposable {
    public constructor() {
        super()

        settings.autoMount = "#lingo3d-world"

        const el = createElement(`
            <div style="width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; display: flex">
                <lingo3d-toolbar></lingo3d-toolbar>
                <lingo3d-scenegraph></lingo3d-scenegraph>
                <lingo3d-editor></lingo3d-editor>
                <lingo3d-node-editor></lingo3d-node-editor>
                <lingo3d-library></lingo3d-library>
                <lingo3d-hud></lingo3d-hud>
                <div id="lingo3d-world" style="height: 100%; flex-grow: 1; position: relative"></div>
            </div>
        `)
        document.body.appendChild(el)

        this.then(() => {
            document.body.removeChild(el)
            settings.autoMount = false
        })
    }
}
