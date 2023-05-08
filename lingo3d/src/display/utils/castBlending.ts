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

export const castBackBlending = (blending: number): Blending => {
    switch (blending) {
        case AdditiveBlending:
            return "additive"
        case SubtractiveBlending:
            return "subtractive"
        case MultiplyBlending:
            return "multiply"
        case NormalBlending:
            return "normal"
        default:
            throw new Error("Unknown blending mode")
    }
}