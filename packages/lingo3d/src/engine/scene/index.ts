import defaultLight from "./defaultLight"
import defaultFog from "./defaultFog"
import background from "./background"

preventTreeShake(defaultLight)
preventTreeShake(defaultFog)
preventTreeShake(background)

import scene from "./scene"
import { preventTreeShake } from "@lincode/utils"
export default scene