import * as lingo from "lingo3d"

lingo.settings.autoMount = true

for (const [key, value] of Object.entries(lingo)) {
    if (!(key in window)) {
        //@ts-ignore
        window[key] = value
    } else console.warn(key)
}

const setFrameProperty = (key: string, value: any) =>
    //@ts-ignore
    window.frameElement && (window.frameElement[key] = value)

setFrameProperty("$eval", eval)
