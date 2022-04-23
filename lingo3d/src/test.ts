import index, { container } from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"
import settings from "./api/settings"
import { setFillWindow } from "./states/useFillWindow"

preventTreeShake([index, test])

settings.autoMount = true
setFillWindow(true)