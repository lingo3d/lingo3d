import ITexturedStandard from "./ITexturedStandard"
import { Mesh, BufferGeometry, MeshStandardMaterial } from "three"

export default interface ITextureManager extends ITexturedStandard {
    defaults: Record<string, any>
    object3d: Mesh<BufferGeometry, MeshStandardMaterial>
}
