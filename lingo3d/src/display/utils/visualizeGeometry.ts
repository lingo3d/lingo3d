import { BufferGeometry, Mesh } from "three"
import scene from "../../engine/scene"
import { standardMaterial } from "./reusables"

export default (geometry: BufferGeometry) => {
    const mesh = new Mesh(geometry, standardMaterial)
    scene.add(mesh)
    return mesh
}
