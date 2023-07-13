import { uuidMapAssertGet } from "../collections/idCollections"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import ICharacterRigJoint, {
    characterRigJointDefaults,
    characterRigJointSchema
} from "../interface/ICharacterRigJoint"
import CharacterRig from "./CharacterRig"
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
    public characterRig!: CharacterRig

    public constructor() {
        super()
        this.scale = 0.03

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
        if (!val) return
        this.boneManager = uuidMapAssertGet(this.characterRig[val] as string)
        this.placeAt(this.boneManager.getWorldPosition())
        this.characterRig.$jointMap.set(val, this)
    }

    public $attachBone() {
        this.boneManager.$disableSerialize = false
        this.boneManager.characterRig = this.characterRig
        this.$innerObject.attach(this.boneManager.$object)
    }
}
