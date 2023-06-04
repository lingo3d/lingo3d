import * as lingo3d from "lingo3d"

lingo3d.settings.autoMount = true
//@ts-ignore
window.lingo3d = lingo3d

const setFrameProperty = (key: string, value: any) =>
    //@ts-ignore
    window.frameElement && (window.frameElement[key] = value)

setFrameProperty("$eval", eval)
