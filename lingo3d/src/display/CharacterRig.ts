import ICharacterRig, {
    CharacterRigJointName,
    characterRigDefaults,
    characterRigSchema
} from "../interface/ICharacterRig"
import { configCharacterRigSystem } from "../systems/configLoadedSystems/configCharacterRigSystem"
import Nullable from "../interface/utils/Nullable"
import CharacterRigJoint from "./CharacterRigJoint"
import { AppendableNode } from "../api/serializer/types"
import MeshAppendable from "./core/MeshAppendable"
import Model from "./Model"
import { appendToCharacterRigSystem } from "../systems/configLoadedSystems/appendToCharacterRigSystem"

export default class CharacterRig
    extends MeshAppendable
    implements ICharacterRig
{
    public static componentName = "characterRig"
    public static defaults = characterRigDefaults
    public static schema = characterRigSchema

    public jointMap = new Map<CharacterRigJointName, CharacterRigJoint>()
    public $jointNodes?: Array<AppendableNode>
    public model?: Model

    public target: Nullable<string>

    public hips: Nullable<string>
    public spine0: Nullable<string>
    public spine1: Nullable<string>
    public spine2: Nullable<string>
    public neck: Nullable<string>
    public head: Nullable<string>

    public leftShoulder: Nullable<string>
    public leftArm: Nullable<string>
    public leftForeArm: Nullable<string>
    public leftHand: Nullable<string>

    public rightShoulder: Nullable<string>
    public rightArm: Nullable<string>
    public rightForeArm: Nullable<string>
    public rightHand: Nullable<string>

    public leftThigh: Nullable<string>
    public leftLeg: Nullable<string>
    public leftFoot: Nullable<string>
    public leftForeFoot: Nullable<string>

    public rightThigh: Nullable<string>
    public rightLeg: Nullable<string>
    public rightFoot: Nullable<string>
    public rightForeFoot: Nullable<string>

    private _enabled = false
    public get enabled() {
        return this._enabled
    }
    public set enabled(val) {
        this._enabled = val
        val
            ? configCharacterRigSystem.add(this)
            : configCharacterRigSystem.delete(this)
    }

    public override append(object: Model | CharacterRigJoint) {
        super.append(object)
        if (!(object instanceof Model)) return
        this.target = object.uuid
        appendToCharacterRigSystem.add(this)
    }

    public override attach(object: Model | CharacterRigJoint) {
        super.attach(object)
        if (!(object instanceof Model)) return
        this.target = object.uuid
        appendToCharacterRigSystem.add(this)
    }
}
