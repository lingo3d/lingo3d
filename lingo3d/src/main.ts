import index from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"

preventTreeShake([index, test])

const editor = new LingoEditor()