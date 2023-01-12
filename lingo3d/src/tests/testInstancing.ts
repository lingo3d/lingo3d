import { InstancedMesh, Mesh, Object3D } from "three"
import Model from "../display/Model"
import { standardMaterial } from "../display/utils/reusables"
import scene from "../engine/scene"

export default {}

const model = new Model(true)
model.src = "casa2.glb"

model.onLoad = () => {
    const loaded = model.loadedGroup.children[0]
    loaded.traverse((child: Object3D | Mesh) => {
        if (!("geometry" in child)) return
        const instancedMesh = new InstancedMesh(
            child.geometry,
            standardMaterial,
            100
        )
        scene.add(instancedMesh)
    })
}
