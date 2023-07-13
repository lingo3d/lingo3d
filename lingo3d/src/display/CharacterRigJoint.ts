import { uuidMapAssertGet } from "../collections/idCollections"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import CharacterRig from "./CharacterRig"
import FoundManager from "./core/FoundManager"
import GimbalObjectManager from "./core/GimbalObjectManager"
import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint extends GimbalObjectManager {
    public boneManager: FoundManager

    public constructor(
        private characterRig: CharacterRig,
        name: CharacterRigJointName
    ) {
        super()
        this.$disableSerialize = true
        this.scale = 0.05
        this.name = name
        characterRig.append(this)

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

        this.boneManager = uuidMapAssertGet(characterRig[name] as string)
        this.placeAt(this.boneManager.getWorldPosition())
    }

    public $attachBone() {
        this.boneManager.$disableSerialize = false
        this.boneManager.$characterRig = this.characterRig
        this.$innerObject.attach(this.boneManager.$object)
    }
}
