import { uuidMap } from "../collections/idCollections"
import CharacterRig from "./CharacterRig"
import FoundManager from "./core/FoundManager"
import Cube from "./primitives/Cube"
import Sphere from "./primitives/Sphere"

export default class CharacterRigJoint extends Sphere {
    private foundManager: FoundManager

    public constructor(uuid: string, characterRig: CharacterRig, name: string) {
        super()
        this.$ghost()
        this.scale = 0.05
        this.depthTest = false
        this.opacity = 0.5
        this.name = name

        const jointDest = new Cube()
        jointDest.$ghost()
        this.append(jointDest)
        jointDest.y = -150
        jointDest.scale = 0.2
        jointDest.depthTest = false
        jointDest.opacity = 0.5

        const foundManager = (this.foundManager = uuidMap.get(
            uuid
        ) as FoundManager)
        foundManager.$unghost()
        foundManager.$characterRig = characterRig
        this.placeAt(foundManager.getWorldPosition())
    }

    public finalize() {
        this.object3d.attach(this.foundManager.outerObject3d)
    }
}
