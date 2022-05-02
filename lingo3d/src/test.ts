import index from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import { setFillWindow } from "./states/useFillWindow"
import "./editor/Editor"
import "./editor/SceneGraph"

preventTreeShake([index, test])

settings.autoMount = true
setFillWindow(true)

const uiContainer = document.createElement("div")
document.body.appendChild(uiContainer)
Object.assign(uiContainer.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    height: "100vh",
    zIndex: "10"
})

// uiContainer.innerHTML = `
//     <lingo3d-scenegraph></lingo3d-scenegraph>
//     <lingo3d-editor></lingo3d-editor>
// `