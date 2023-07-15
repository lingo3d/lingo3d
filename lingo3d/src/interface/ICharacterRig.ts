import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import { ExtractProps } from "./utils/extractProps"

export type CharacterRigJointName =
    | "hips"
    | "spine0"
    | "spine1"
    | "spine2"
    | "neck"
    | "head"
    | "leftShoulder"
    | "leftArm"
    | "leftForeArm"
    | "leftHand"
    | "rightShoulder"
    | "rightArm"
    | "rightForeArm"
    | "rightHand"
    | "leftThigh"
    | "leftLeg"
    | "leftFoot"
    | "leftForeFoot"
    | "rightThigh"
    | "rightLeg"
    | "rightFoot"
    | "rightForeFoot"

export default interface ICharacterRig extends IAppendable {
    target: Nullable<string>
    enabled: boolean

    hips: Nullable<string>
    spine0: Nullable<string>
    spine1: Nullable<string>
    spine2: Nullable<string>
    neck: Nullable<string>
    head: Nullable<string>

    leftShoulder: Nullable<string>
    leftArm: Nullable<string>
    leftForeArm: Nullable<string>
    leftHand: Nullable<string>

    rightShoulder: Nullable<string>
    rightArm: Nullable<string>
    rightForeArm: Nullable<string>
    rightHand: Nullable<string>

    leftThigh: Nullable<string>
    leftLeg: Nullable<string>
    leftFoot: Nullable<string>
    leftForeFoot: Nullable<string>

    rightThigh: Nullable<string>
    rightLeg: Nullable<string>
    rightFoot: Nullable<string>
    rightForeFoot: Nullable<string>
}

export const characterRigSchema: Required<ExtractProps<ICharacterRig>> = {
    ...appendableSchema,

    target: String,
    enabled: Boolean,

    hips: String,
    spine0: String,
    spine1: String,
    spine2: String,
    neck: String,
    head: String,

    leftShoulder: String,
    leftArm: String,
    leftForeArm: String,
    leftHand: String,

    rightShoulder: String,
    rightArm: String,
    rightForeArm: String,
    rightHand: String,

    leftThigh: String,
    leftLeg: String,
    leftFoot: String,
    leftForeFoot: String,

    rightThigh: String,
    rightLeg: String,
    rightFoot: String,
    rightForeFoot: String
}

export const characterRigDefaults = extendDefaults<ICharacterRig>(
    [appendableDefaults],
    {
        target: undefined,
        enabled: false,

        hips: undefined,
        spine0: undefined,
        spine1: undefined,
        spine2: undefined,
        neck: undefined,
        head: undefined,

        leftShoulder: undefined,
        leftArm: undefined,
        leftForeArm: undefined,
        leftHand: undefined,

        rightShoulder: undefined,
        rightArm: undefined,
        rightForeArm: undefined,
        rightHand: undefined,

        leftThigh: undefined,
        leftLeg: undefined,
        leftFoot: undefined,
        leftForeFoot: undefined,

        rightThigh: undefined,
        rightLeg: undefined,
        rightFoot: undefined,
        rightForeFoot: undefined
    }
)
