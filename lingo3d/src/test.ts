import index from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import { setFillWindow } from "./states/useFillWindow"
import "./editor/Editor"
import { uiContainer } from "./engine/renderLoop/renderSetup"

preventTreeShake([index, test])

settings.autoMount = true
setFillWindow(true)

uiContainer.innerHTML = `
    <lingo3d-editor></lingo3d-editor>
`