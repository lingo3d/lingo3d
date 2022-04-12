import { debounce } from "@lincode/utils"
import background from "../../../api/background"
import settings from "../../../api/settings"
import rendering from "../../../api/rendering"
import { SetupNode } from "./types"

let defaults: Record<Exclude<keyof SetupNode, "type">, any> | undefined

const settingsKeys = [
    "performance",
    "gridHelper",
    "cameraHelper",
    "lightHelper",
    "defaultFog",
    "defaultLight",
    "defaultOrbitControls"
]

export default debounce((node: Partial<SetupNode>) => {
    defaults ??=  { ...settings, ...rendering, ...background }

    for (const key of settingsKeys)
        //@ts-ignore
        settings[key] = node[key] ?? defaults[key]

    for (const key of Object.keys(rendering))
        //@ts-ignore
        rendering[key] = node[key] ?? defaults[key]

    for (const key of Object.keys(background))
        //@ts-ignore
        background[key] = node[key] ?? defaults[key]
    
}, 0, "trailing")