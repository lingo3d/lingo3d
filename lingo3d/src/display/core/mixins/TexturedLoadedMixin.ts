import { Group } from "three"
import Loaded from "../Loaded"

export default abstract class TexturedModelMixin extends Loaded<Group> {
    public get metalness() {
        return 0
    }
    public set metalness(val: number) {
        
    }

//     public init() {
//         if (!(mat instanceof MeshStandardMaterial)) {
//             child.material = new MeshStandardMaterial()
//             MeshStandardMaterial.prototype.copy.call(child.material, mat)
//         }
//         child.material.roughness *= 0.5
//         child.material.metalness *= 2
//     }
}