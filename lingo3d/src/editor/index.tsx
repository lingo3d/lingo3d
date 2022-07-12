import "./Editor"
import "./NodeEditor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"
import "./HUD"
import settings from "../api/settings"
import { Disposable } from "@lincode/promiselikes"
import createElement from "../utils/createElement"
import { render } from "preact"
import CustomEditor from "./CustomEditor"
import Input from "./CustomEditor/Input"

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
                <div id="customEditor"></div>
                <lingo3d-node-editor></lingo3d-node-editor>
                <lingo3d-library></lingo3d-library>
                <lingo3d-hud></lingo3d-hud>
                <div id="lingo3d-world" style="height: 100%; flex-grow: 1; position: relative"></div>
            </div>
        `)
        document.body.appendChild(el)

        render(
            <CustomEditor>
                <Input name="hello" value={0} />
                <Input name="world" value={false} />
                <Input name="test" value="option 0" choices={["option 0", "option 1", "option 2"]} onChange={val => console.log(val)} />
            </CustomEditor>,
            //@ts-ignore
            customEditor
        )

        this.then(() => {
            document.body.removeChild(el)
            settings.autoMount = false
        })
    }
}
