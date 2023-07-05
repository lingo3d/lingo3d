import { uuidMap } from "../collections/idCollections"
import CharacterRig from "./CharacterRig"
import FoundManager from "./core/FoundManager"
import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint extends Sphere {
    private foundManager: FoundManager

    public constructor(
        uuid: string,
        private characterRig: CharacterRig,
        name: string
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

        this.foundManager = uuidMap.get(uuid) as FoundManager
        this.placeAt(this.foundManager.getWorldPosition())
    }

    public finalize() {
        this.foundManager.$unghost()
        this.foundManager.$characterRig = this.characterRig
        this.object3d.attach(this.foundManager.outerObject3d)
    }
}
