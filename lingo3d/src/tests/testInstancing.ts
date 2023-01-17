import { InstancedMesh, Mesh, Object3D } from "three"
import Model from "../display/Model"
import scene from "../engine/scene"

export default {}

// for (let i = 0; i < 100; ++i) {
//     const model = new Model()
//     model.src = "tree1.glb"
// }

// const model = new Model(true)
// model.src = "tree1.glb"

// model.onLoad = () => {
//     const loaded = model.loadedObject3d
//     loaded.traverse((child: Object3D | Mesh) => {
//         if (!("geometry" in child)) return
//         const instancedMesh = new InstancedMesh(
//             child.geometry,
//             child.material,
//             100
//         )
//         scene.add(instancedMesh)
//     })
// }
