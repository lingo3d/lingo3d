import { settings, runtime } from "lingo3d"

settings.autoMount = true

for (const [key, value] of Object.entries(runtime)) {
    //@ts-ignore
    window[key] = value
}

const setFrameProperty = (key: string, value: any) =>
    //@ts-ignore
    window.frameElement && (window.frameElement[key] = value)

setFrameProperty("$eval", eval)
setFrameProperty("$runtime", runtime)
