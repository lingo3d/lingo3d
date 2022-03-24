import index, { container } from "."
import test from "./tests/testVR"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])

document.body.appendChild(container)