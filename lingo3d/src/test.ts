import index, { container } from "."
import test from "./tests/testKeannu"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])