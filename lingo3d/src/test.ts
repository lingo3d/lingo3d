import index, { container } from "."
import test from "./tests/testPhysics"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])