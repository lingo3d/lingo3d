import { getBloom, setBloom } from "../states/useBloom"
import { AmbientOcclusion, getAmbientOcclusion, setAmbientOcclusion } from "../states/useAmbientOcclusion"
import { getBloomRadius, setBloomRadius } from "../states/useBloomRadius"
import { getBloomStrength, setBloomStrength } from "../states/useBloomStrength"
import { getBloomThreshold, setBloomThreshold } from "../states/useBloomThreshold"
import { getExposure, setExposure } from "../states/useExposure"
import { getLogarithmicDepth, setLogarithmicDepth } from "../states/useLogarithmicDepth"
import { Encoding, getEncoding, setEncoding } from "../states/useEncoding"
import { getPBR, setPBR } from "../states/usePBR"
import { getOutlineColor, setOutlineColor } from "../states/useOutlineColor"
import { getOutlineHiddenColor, setOutlineHiddenColor } from "../states/useOutlineHiddenColor"
import { getOutlinePattern, setOutlinePattern } from "../states/useOutlinePattern"
import { getOutlinePulse, setOutlinePulse } from "../states/useOutlinePulse"
import { getOutlineStrength, setOutlineStrength } from "../states/useOutlineStrength"
import { getOutlineThickness, setOutlineThickness } from "../states/useOutlineThickness"

export default {
    get logarithmicDepth() {
        return getLogarithmicDepth()
    },
    set logarithmicDepth(value: boolean) {
        setLogarithmicDepth(value)
    },

    get encoding() {
        return getEncoding()
    },
    set encoding(val: Encoding) {
        setEncoding(val)
    },

    get exposure() {
        return getExposure()
    },
    set exposure(value: number) {
        setExposure(value)
    },

    get pbr() {
        return getPBR()
    },
    set pbr(value: boolean) {
        setPBR(value)
    },

    get bloom() {
        return getBloom()
    },
    set bloom(value: boolean) {
        setBloom(value)
    },

    get bloomStrength() {
        return getBloomStrength()
    },
    set bloomStrength(value: number) {
        setBloomStrength(value)
    },

    get bloomRadius() {
        return getBloomRadius()
    },
    set bloomRadius(value: number) {
        setBloomRadius(value)
    },

    get bloomThreshold() {
        return getBloomThreshold()
    },
    set bloomThreshold(value: number) {
        setBloomThreshold(value)
    },

    get ambientOcclusion() {
        return getAmbientOcclusion()
    },
    set ambientOcclusion(value: AmbientOcclusion) {
        setAmbientOcclusion(value)
    },

    get outlineColor() {
        return getOutlineColor()
    },
    set outlineColor(value: string) {
        setOutlineColor(value)
    },

    get outlineHiddenColor() {
        return getOutlineHiddenColor()
    },
    set outlineHiddenColor(value: string | undefined) {
        setOutlineHiddenColor(value)
    },

    get outlinePattern() {
        return getOutlinePattern()
    },
    set outlinePattern(value: string | undefined) {
        setOutlinePattern(value)
    },

    get outlinePulse() {
        return getOutlinePulse()
    },
    set outlinePulse(value: number) {
        setOutlinePulse(value)
    },

    get outlineStrength() {
        return getOutlineStrength()
    },
    set outlineStrength(value: number) {
        setOutlineStrength(value)
    },

    get outlineThickness() {
        return getOutlineThickness()
    },
    set outlineThickness(value: number) {
        setOutlineThickness(value)
    }
}