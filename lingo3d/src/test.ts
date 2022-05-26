import index from "."
import test from "./tests/testDummy"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import "./editor"

preventTreeShake([index, test])

settings.autoMount = "#lingoapp"

const lingo3dContainer = document.createElement("div")
document.body.appendChild(lingo3dContainer)
Object.assign(lingo3dContainer.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    height: "100%",
    display: "flex"
})

lingo3dContainer.innerHTML = `
    <div style="height: 100%">
        <lingo3d-toolbar></lingo3d-toolbar>
        <lingo3d-scenegraph></lingo3d-scenegraph>
        <lingo3d-editor></lingo3d-editor>
        <lingo3d-library></lingo3d-library>
    </div>
    <div id="lingoapp" style="height: 100%; flex-grow: 1; position: relative"></div>
`