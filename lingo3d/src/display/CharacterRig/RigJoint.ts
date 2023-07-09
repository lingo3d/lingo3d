import { uuidMap } from "../../collections/idCollections"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import CharacterRig from "."
import FoundManager from "../core/FoundManager"
import Cube from "../primitives/Cube"
import Sphere from "../primitives/Sphere"

export default class RigJoint extends Sphere {
    private foundManager: FoundManager

    public constructor(
        private characterRig: CharacterRig,
        name: CharacterRigJointName
    ) {
        super()
        this.scale = 0.05
        this.depthTest = false
        this.opacity = 0.5
        this.name = name
        characterRig.append(this)

        const jointDest = new Cube()
        jointDest.$ghost()
        this.append(jointDest)
        jointDest.y = -150
        jointDest.scale = 0.2
        jointDest.depthTest = false
        jointDest.opacity = 0.5

        this.foundManager = uuidMap.get(
            characterRig[name] as string
        ) as FoundManager
        this.placeAt(this.foundManager.getWorldPosition())
    }

    public finalize() {
        this.foundManager.$disableSerialize = false
        this.foundManager.$characterRig = this.characterRig
        this.$innerObject.attach(this.foundManager.$object)
    }
}
