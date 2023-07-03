import ICharacterRigJoint, {
    characterRigJointDefaults,
    characterRigJointSchema
} from "../interface/ICharacterRigJoint"
import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint
    extends Sphere
    implements ICharacterRigJoint
{
    public static override componentName = "characterRigJoint"
    public static override defaults = characterRigJointDefaults
    public static override schema = characterRigJointSchema

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
