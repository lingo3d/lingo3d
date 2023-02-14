import { setAssetsPath, settings } from "."
import "./tests/testGameGraph"
import LingoEditor from "./editor"

setAssetsPath("assets/")

settings.autoMount = true

const editor = new LingoEditor()
