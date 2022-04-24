import index from "."
import test from "./tests/testMachine"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import { setFillWindow } from "./states/useFillWindow"
import Editor from "./editor"

preventTreeShake([index, test])

settings.autoMount = true
setFillWindow(true)

// const editor = new Editor()
// document.body.appendChild(editor)