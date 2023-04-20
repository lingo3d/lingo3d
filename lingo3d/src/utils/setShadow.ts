import { Object3D } from "three"
import { shadowModePtr } from "../pointers/shadowModePtr"

export default <T extends Object3D>(object: T, val: boolean) => {
    if (!shadowModePtr[0]) return object
    object.castShadow = object.receiveShadow = val
    return object
}
