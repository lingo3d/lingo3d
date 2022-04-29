import index from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import { setFillWindow } from "./states/useFillWindow"
import "./editor"

preventTreeShake([index, test])

settings.autoMount = true
setFillWindow(true)

const editor = document.createElement("div")
editor.innerHTML = `
    <lingo3d-editor></lingo3d-editor>
`
document.body.appendChild(editor)