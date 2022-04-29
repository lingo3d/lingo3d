import ICameraBase, { cameraBaseDefaults, cameraBaseSchema } from "./ICameraBase"
import { ExtractProps } from "./utils/extractProps"

export default interface ICamera extends ICameraBase {}

export const cameraSchema: Required<ExtractProps<ICamera>> = {
    ...cameraBaseSchema
}

export const cameraDefaults: ICamera = {
    ...cameraBaseDefaults
}