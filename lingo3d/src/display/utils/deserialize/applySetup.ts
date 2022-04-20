import { debounce } from "@lincode/utils"
import background from "../../../api/background"
import settings from "../../../api/settings"
import rendering from "../../../api/rendering"
import ISetup from "../../../interface/ISetup"

let defaults: Record<keyof ISetup, any> | undefined

const settingsKeys = [
    "performance",
    "gridHelper",
    "cameraHelper",
    "lightHelper",
    "defaultFog",
    "defaultLight",
    "defaultLightScale",
    "defaultOrbitControls",
    "gravity",
    "mapPhysics",
    "wasmPath"
]

export default debounce((node: ISetup) => {
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