import index, { container } from "."
import test from "./tests/testLink"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])