import { getBloom, setBloom } from "../states/useBloom"
import { getAmbientOcclusion, setAmbientOcclusion } from "../states/useAmbientOcclusion"
import { getBloomRadius, setBloomRadius } from "../states/useBloomRadius"
import { getBloomStrength, setBloomStrength } from "../states/useBloomStrength"
import { getBloomThreshold, setBloomThreshold } from "../states/useBloomThreshold"
import { getExposure, setExposure } from "../states/useExposure"
import { getLogarithmicDepth, setLogarithmicDepth } from "../states/useLogarithmicDepth"
import { getEncoding, setEncoding } from "../states/useEncoding"
import { getPBR, setPBR } from "../states/usePBR"
import { getOutlineColor, setOutlineColor } from "../states/useOutlineColor"
import { getOutlineHiddenColor, setOutlineHiddenColor } from "../states/useOutlineHiddenColor"
import { getOutlinePattern, setOutlinePattern } from "../states/useOutlinePattern"
import { getOutlinePulse, setOutlinePulse } from "../states/useOutlinePulse"
import { getOutlineStrength, setOutlineStrength } from "../states/useOutlineStrength"
import { getOutlineThickness, setOutlineThickness } from "../states/useOutlineThickness"
import { getLensDistortion, setLensDistortion } from "../states/useLensDistortion"
import { getLensIOR, setLensIOR } from "../states/useLensIOR"
import { getLensBand, setLensBand } from "../states/useLensBand"

export default {
    get logarithmicDepth() {
        return getLogarithmicDepth()
    },
    set logarithmicDepth(value) {
        setLogarithmicDepth(value)
    },

    get encoding() {
        return getEncoding()
    },
    set encoding(val) {
        setEncoding(val)
    },

    get exposure() {
        return getExposure()
    },
    set exposure(value) {
        setExposure(value)
    },

    get pbr() {
        return getPBR()
    },
    set pbr(value) {
        setPBR(value)
    },

    get bloom() {
        return getBloom()
    },
    set bloom(value) {
        setBloom(value)
    },

    get bloomStrength() {
        return getBloomStrength()
    },
    set bloomStrength(value) {
        setBloomStrength(value)
    },

    get bloomRadius() {
        return getBloomRadius()
    },
    set bloomRadius(value) {
        setBloomRadius(value)
    },

    get bloomThreshold() {
        return getBloomThreshold()
    },
    set bloomThreshold(value) {
        setBloomThreshold(value)
    },

    get ambientOcclusion() {
        return getAmbientOcclusion()
    },
    set ambientOcclusion(value) {
        setAmbientOcclusion(value)
    },

    get outlineColor() {
        return getOutlineColor()
    },
    set outlineColor(value) {
        setOutlineColor(value)
    },

    get outlineHiddenColor() {
        return getOutlineHiddenColor()
    },
    set outlineHiddenColor(value) {
        setOutlineHiddenColor(value)
    },

    get outlinePattern() {
        return getOutlinePattern()
    },
    set outlinePattern(value) {
        setOutlinePattern(value)
    },

    get outlinePulse() {
        return getOutlinePulse()
    },
    set outlinePulse(value) {
        setOutlinePulse(value)
    },

    get outlineStrength() {
        return getOutlineStrength()
    },
    set outlineStrength(value) {
        setOutlineStrength(value)
    },

    get outlineThickness() {
        return getOutlineThickness()
    },
    set outlineThickness(value) {
        setOutlineThickness(value)
    },

    get lensDistortion() {
        return getLensDistortion()
    },
    set lensDistortion(val) {
        setLensDistortion(val)
    },

    get lensIOR() {
        return getLensIOR()
    },
    set lensIOR(val) {
        setLensIOR(val)
    },

    get lensBand() {
        return getLensBand()
    },
    set lensBand(val) {
        setLensBand(val)
    }
}