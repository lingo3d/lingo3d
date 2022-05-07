import defaultLight from "./defaultLight"
import defaultFog from "./defaultFog"
import background from "./background"

preventTreeShake([defaultLight, defaultFog, background])

import scene from "./scene"
import { preventTreeShake } from "@lincode/utils"
export default scene