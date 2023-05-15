import { MeshStandardMaterial, Texture } from "three"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import Model from "../display/Model"

export const uuidMap = new Map<string, Appendable | MeshAppendable>()
export const uuidTextureMap = new Map<string, Texture>()
export const uuidMaterialMap = new Map<string, MeshStandardMaterial>()
export const userIdMap = new Map<string, Set<Appendable | MeshAppendable>>()
export const idRenderCheckMap = new Map<number, MeshAppendable>()
export const idRenderCheckModelMap = new Map<number, Model>()

export const getAppendablesById = (id: string) => {
    const uuidInstance = uuidMap.get(id)
    if (uuidInstance) return [uuidInstance]
    return userIdMap.get(id) ?? []
}
