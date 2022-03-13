import { getBloom, setBloom } from "../states/useBloom"
import { getAmbientOcclusion, setAmbientOcclusion } from "../states/useAmbientOcclusion"
import { getBloomRadius, setBloomRadius } from "../states/useBloomRadius"
import { getBloomStrength, setBloomStrength } from "../states/useBloomStrength"
import { getBloomThreshold, setBloomThreshold } from "../states/useBloomThreshold"
import { getBokeh, setBokeh } from "../states/useBokeh"
import { getBokehAperture, setBokehAperture } from "../states/useBokehAperture"
import { getBokehFocus, setBokehFocus } from "../states/useBokehFocus"
import { getBokehMaxBlur, setBokehMaxBlur } from "../states/useBokehMaxBlur"
import { getExposure, setExposure } from "../states/useExposure"
import { getToneMapping, setToneMapping } from "../states/useToneMapping"

export default {
    get toneMapping() {
        return getToneMapping()
    },
    set toneMapping(value: boolean) {
        setToneMapping(value)
    },

    get exposure() {
        return getExposure()
    },
    set exposure(value: number) {
        setExposure(value)
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

    get bokeh() {
        return getBokeh()
    },
    set bokeh(value: boolean) {
        setBokeh(value)
    },

    get bokehFocus() {
        return getBokehFocus()
    },
    set bokehFocus(value: number) {
        setBokehFocus(value)
    },

    get bokehMaxBlur() {
        return getBokehMaxBlur()
    },
    set bokehMaxBlur(value: number) {
        setBokehMaxBlur(value)
    },

    get bokehAperture() {
        return getBokehAperture()
    },
    set bokehAperture(value: number) {
        setBokehAperture(value)
    },

    get ambientOcclusion() {
        return getAmbientOcclusion()
    },
    set ambientOcclusion(value: boolean) {
        setAmbientOcclusion(value)
    }
}