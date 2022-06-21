import index from "."
import test from "./tests/testPointClick"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"

preventTreeShake([index, test])

const editor = new LingoEditor()