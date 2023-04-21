import { Object3D } from "three"
import { castShadowPtr } from "../pointers/castShadowPtr"

export default <T extends Object3D>(object: T, val: boolean) => {
    object.receiveShadow = val
    object.castShadow = val && castShadowPtr[0]
    return object
}
