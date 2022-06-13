import index from "."
import test from "./tests/testDummy"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import "./editor"

preventTreeShake([index, test])

settings.autoMount = "#world"

document.body.innerHTML = `
    <div style="width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; display: flex">
        <lingo3d-toolbar></lingo3d-toolbar>
        <lingo3d-scenegraph></lingo3d-scenegraph>
        <lingo3d-editor></lingo3d-editor>
        <lingo3d-library></lingo3d-library>
        <lingo3d-keymap></lingo3d-keymap>
        <div id="world" style="height: 100%; flex-grow: 1; position: relative"></div>
    </div>
`