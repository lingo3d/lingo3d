import { MeshStandardMaterial, Texture } from "three"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import Model from "../display/Model"
import Loaded from "../display/core/Loaded"
import { createMap } from "../utils/createCollection"

export const uuidMap = createMap<string, Appendable | MeshAppendable | Loaded>()
export const uuidTextureMap = createMap<string, Texture>()
export const uuidMaterialMap = createMap<string, MeshStandardMaterial>()
export const userIdMap = createMap<
    string,
    Set<Appendable | MeshAppendable | Loaded>
>()
export const idRenderCheckMap = createMap<number, MeshAppendable>()
export const idRenderCheckModelMap = createMap<number, Model>()

export const getAppendablesById = (id: string) => {
    const uuidInstance = uuidMap.get(id)
    if (uuidInstance) return [uuidInstance]
    return userIdMap.get(id) ?? []
}
