import ICameraMixin, { cameraMixinDefaults, cameraMixinSchema } from "./ICameraMixin"
import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export type MouseControlMode = "orbit" | "stationary"
export type MouseControl = boolean | "drag"

export default interface ICameraBase extends IObjectManager, ICameraMixin {
    mouseControl: MouseControl
    mouseControlMode?: MouseControlMode
}

export const cameraBaseSchema: Required<ExtractProps<ICameraBase>> = {
    ...objectManagerSchema,
    ...cameraMixinSchema,

    mouseControl: [Boolean, String],
    mouseControlMode: String
}

export const cameraBaseDefaults: ICameraBase = {
    ...objectManagerDefaults,
    ...cameraMixinDefaults,
    
    mouseControl: false
}