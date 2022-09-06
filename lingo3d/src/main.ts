import index, { settings } from "."
import test from "./tests/testGLTF"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"

preventTreeShake([index, test])

settings.autoMount = true

// const editor = new LingoEditor()
