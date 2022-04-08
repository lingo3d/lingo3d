import index, { container } from "."
import test from "./tests/testMinecraft"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])