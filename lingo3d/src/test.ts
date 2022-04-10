import index, { container } from "."
import test from "./tests/testFbx"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])