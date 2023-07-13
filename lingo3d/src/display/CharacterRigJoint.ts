import { uuidMapAssertGet } from "../collections/idCollections"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import ICharacterRigJoint, {
    characterRigJointDefaults,
    characterRigJointSchema
} from "../interface/ICharacterRigJoint"
import { CharacterRigPtr } from "../pointers/CharacterRigPtr"
import FoundManager from "./core/FoundManager"
import GimbalObjectManager from "./core/GimbalObjectManager"
import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint
    extends GimbalObjectManager
    implements ICharacterRigJoint
{
    public static componentName = "characterRigJoint"
    public static defaults = characterRigJointDefaults
    public static schema = characterRigJointSchema

    public boneManager!: FoundManager

    public constructor() {
        super()
        this.scale = 0.05

        const jointSrc = new Sphere()
        jointSrc.$ghost()
        this.append(jointSrc)
        jointSrc.depthTest = false
        jointSrc.opacity = 0.5

        const jointDest = new Cube()
        jointDest.$ghost()
        this.append(jointDest)
        jointDest.y = -150
        jointDest.scale = 0.2
        jointDest.depthTest = false
        jointDest.opacity = 0.5
    }

    private _target: CharacterRigJointName | undefined
    public get target() {
        return this._target
    }
    public set target(val: CharacterRigJointName | undefined) {
        this._target = val
        if (!val || !(this.parent instanceof CharacterRigPtr[0])) return
        this.boneManager = uuidMapAssertGet(this.parent[val] as string)
        this.placeAt(this.boneManager.getWorldPosition())
        this.parent.$jointMap.set(val, this)
    }

    public $attachBone() {
        this.boneManager.$disableSerialize = false
        this.boneManager.characterRig = this.parent as any
        this.$innerObject.attach(this.boneManager.$object)
    }
}
