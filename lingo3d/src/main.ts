import index, { settings } from "."
import test from "./tests/testSpline"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"

preventTreeShake([index, test])

settings.autoMount = true
// settings.defaultLight = false

const editor = new LingoEditor()
