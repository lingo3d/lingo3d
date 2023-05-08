import {
    AdditiveBlending,
    MultiplyBlending,
    NormalBlending,
    SubtractiveBlending,
    Blending as ThreeBlending
} from "three"
import { Blending } from "../../interface/ITexturedStandard"

export const castBlending = (blending: Blending): ThreeBlending => {
    switch (blending) {
        case "additive":
            return AdditiveBlending
        case "subtractive":
            return SubtractiveBlending
        case "multiply":
            return MultiplyBlending
        case "normal":
            return NormalBlending
        default:
            throw new Error("Unknown blending mode")
    }
}
