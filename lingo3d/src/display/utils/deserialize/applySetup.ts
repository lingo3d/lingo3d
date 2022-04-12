import { debounce } from "@lincode/utils"
import background from "../../../api/background"
import settings from "../../../api/settings"
import rendering from "../../../api/rendering"
import { SetupNode } from "./types"

const defaults: Record<Exclude<keyof SetupNode, "type">, any> = { ...settings, ...rendering, ...background }

export default debounce((node: Partial<SetupNode>) => {
    for (const key of Object.keys(settings))
        //@ts-ignore
        settings[key] = node[key] ?? defaults[key]

    for (const key of Object.keys(rendering))
        //@ts-ignore
        rendering[key] = node[key] ?? defaults[key]

    for (const key of Object.keys(background))
        //@ts-ignore
        background[key] = node[key] ?? defaults[key]
    
}, 0, "trailing")