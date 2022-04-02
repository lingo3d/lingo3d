import index, { container } from "."
import test from "./tests/testBVH"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])