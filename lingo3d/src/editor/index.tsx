import "./Editor"
import "./NodeEditor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import "./LingoEditor"
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

        const el = document.createElement("lingo3d-lingoeditor")
        document.body.appendChild(el)

        this.then(() => {
            document.body.removeChild(el)
        })
    }
}
