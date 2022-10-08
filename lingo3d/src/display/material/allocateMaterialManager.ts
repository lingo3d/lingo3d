import { forceGet } from "@lincode/utils"
import { MeshStandardMaterial } from "three"
import ITexturedStandard from "../../interface/ITexturedStandard"
import StandardMaterialManager from "./StandardMaterialManager"

const materialManagerMap = new Map<string, StandardMaterialManager>()

export default (desc: ITexturedStandard) => {
    let hash = ""
    for (const key of Object.keys(desc).sort())
        hash += `${key}:${(desc as any)[key]};`

    return forceGet(materialManagerMap, hash, () => {
        const material = new StandardMaterialManager(new MeshStandardMaterial())
        Object.assign(material, desc)
        return material
    })
}
