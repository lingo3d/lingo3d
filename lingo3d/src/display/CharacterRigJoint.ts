import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint extends Sphere {
    public constructor() {
        super()
        this.scale = 0.05
        this.depthTest = false
        this.opacity = 0.5

        const jointDest = new Cube()
        jointDest.$ghost()
        this.append(jointDest)
        jointDest.y = -150
        jointDest.scale = 0.2
        jointDest.depthTest = false
        jointDest.opacity = 0.5
    }
}
