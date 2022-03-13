import Cube from "../display/primitives/Cube"
import Sphere from "../display/primitives/Sphere"
//@ts-ignore
import brickDiffuseSrc from "../../assets-local/brick_diffuse.jpg"
//@ts-ignore
import brickRoughnessSrc from "../../assets-local/brick_roughness.jpg"

let object = new Sphere()
object.texture = brickDiffuseSrc
object.roughnessMap = brickRoughnessSrc
object.metalness = 0.5