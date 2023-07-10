import { MeshStandardMaterial, Texture } from "three"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import Model from "../display/Model"
import Loaded from "../display/core/Loaded"
import { createUnloadMap } from "../utils/createUnloadMap"

export const uuidMap = new Map<string, Appendable | MeshAppendable | Loaded>()
export const uuidTextureMap = new Map<string, Texture>()
export const uuidMaterialMap = createUnloadMap<string, MeshStandardMaterial>()
export const userIdMap = createUnloadMap<
    string,
    Set<Appendable | MeshAppendable | Loaded>
>()
export const idRenderCheckMap = new Map<number, MeshAppendable>()
export const idRenderCheckModelMap = new Map<number, Model>()

export const uuidMapAssertGet = <
    T extends Appendable | MeshAppendable | Loaded
>(
    id: string
) => {
    const result = uuidMap.get(id)
    !result && console.error(`uuidMapAssertGet: ${id} is not found`)
    return result as T
}
