import ILightBase, { lightBaseDefaults } from "./ILightBase"

export default interface ISkyLight extends ILightBase {
    groundColor: string
}

export const skyLightDefaults: ISkyLight = {
    ...lightBaseDefaults,
    groundColor: "#ffffff"
}