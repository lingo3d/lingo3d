import { setAssetsPath, settings } from "."
import "./tests/testGeometry"
import LingoEditor from "./editor"

setAssetsPath("assets/")

settings.autoMount = true

const editor = new LingoEditor()
