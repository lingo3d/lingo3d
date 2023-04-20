import { Object3D } from "three"
import { shadowPtr } from "../pointers/shadowPtr"

export default <T extends Object3D>(object: T, val: boolean) => {
    object.receiveShadow = val
    object.castShadow = val && shadowPtr[0]
    return object
}
