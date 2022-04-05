import index, { container } from "."
import test from "./tests/testGLTF"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([index, test])