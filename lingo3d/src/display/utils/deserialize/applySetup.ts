import { debounce } from "@lincode/utils"
import background from "../../../api/background"
import settings from "../../../api/settings"
import rendering from "../../../api/rendering"
import ISetup, { setupDefaults } from "../../../interface/ISetup"

export default debounce((node: Partial<ISetup>) => {
    for (const key of Object.keys(settings))
        //@ts-ignore
        settings[key] = node[key] ?? setupDefaults[key]

    for (const key of Object.keys(rendering))
        //@ts-ignore
        rendering[key] = node[key] ?? setupDefaults[key]

    for (const key of Object.keys(background))
        //@ts-ignore
        background[key] = node[key] ?? setupDefaults[key]
    
}, 0, "trailing")