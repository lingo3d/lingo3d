import index from "."
// import test from "./tests/testGLTF"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"

preventTreeShake([index])

const editor = new LingoEditor()