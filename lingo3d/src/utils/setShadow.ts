import { Object3D } from "three"
import { shadowModePtr } from "../pointers/shadowModePtr"

export default <T extends Object3D>(object: T, val: boolean) => {
    object.castShadow = object.receiveShadow = val
    if (!shadowModePtr[0]) object.castShadow = false
    return object
}
