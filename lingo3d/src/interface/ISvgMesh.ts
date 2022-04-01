import ILoaded, { loadedDefaults } from "./ILoaded"

export default interface ISvgMesh extends ILoaded {}

export const svgMeshDefaults: ISvgMesh = {
    ...loadedDefaults
}