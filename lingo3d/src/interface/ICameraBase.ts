import ICameraMixin, { cameraMixinDefaults, cameraMixinSchema } from "./ICameraMixin"
import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IObjectManager, ICameraMixin {
    mouseControl: MouseControl
}

export const cameraBaseSchema: Required<ExtractProps<ICameraBase>> = {
    ...objectManagerSchema,
    ...cameraMixinSchema,

    mouseControl: [Boolean, String]
}

export const cameraBaseDefaults: Defaults<ICameraBase> = {
    ...objectManagerDefaults,
    ...cameraMixinDefaults,
    
    mouseControl: false
}