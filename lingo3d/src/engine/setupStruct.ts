import { appendableRoot } from "../api/core/Appendable"
import Skybox from "../display/Skybox"
import { getAntiAlias, setAntiAlias } from "../states/useAntiAlias"
import {
    getBackgroundColor,
    setBackgroundColor
} from "../states/useBackgroundColor"
import {
    getBackgroundImage,
    setBackgroundImage
} from "../states/useBackgroundImage"
import { getBloom, setBloom } from "../states/useBloom"
import {
    getBloomIntensity,
    setBloomIntensity
} from "../states/useBloomIntensity"
import {
    getBloomThreshold,
    setBloomThreshold
} from "../states/useBloomThreshold"
import { getCentripetal, setCentripetal } from "../states/useCentripetal"
import { getDefaultLight, setDefaultLight } from "../states/useDefaultLight"
import { getExposure, setExposure } from "../states/useExposure"
import { getGravity, setGravity } from "../states/useGravity"
import { getGridHelper, setGridHelper } from "../states/useGridHelper"
import {
    getGridHelperSize,
    setGridHelperSize
} from "../states/useGridHelperSize"
import {
    getLogarithmicDepth,
    setLogarithmicDepth
} from "../states/useLogarithmicDepth"
import { getOutlineColor, setOutlineColor } from "../states/useOutlineColor"
import {
    getOutlineHiddenColor,
    setOutlineHiddenColor
} from "../states/useOutlineHiddenColor"
import {
    getOutlinePattern,
    setOutlinePattern
} from "../states/useOutlinePattern"
import { getOutlinePulse, setOutlinePulse } from "../states/useOutlinePulse"
import {
    getOutlineStrength,
    setOutlineStrength
} from "../states/useOutlineStrength"
import { getPBR, setPBR } from "../states/usePBR"
import { getPixelRatio, setPixelRatio } from "../states/usePixelRatio"
import { getRepulsion, setRepulsion } from "../states/useRepulsion"
import { getFps, setFps } from "../states/useFps"
import { getSSR, setSSR } from "../states/useSSR"
import { getSSRIntensity, setSSRIntensity } from "../states/useSSRIntensity"
import { getSSAO, setSSAO } from "../states/useSSAO"
import { getSSAOIntensity, setSSAOIntensity } from "../states/useSSAOIntensity"
import { getBloomRadius, setBloomRadius } from "../states/useBloomRadius"
import {
    getShadowDistance,
    setShadowDistance
} from "../states/useShadowDistance"
import {
    getShadowResolution,
    setShadowResolution
} from "../states/useShadowResolution"

const defaultSkybox = new Skybox()
appendableRoot.delete(defaultSkybox)

export default {
    get defaultLight() {
        return getDefaultLight()
    },
    set defaultLight(value) {
        setDefaultLight(value)
    },

    get skybox() {
        return defaultSkybox.texture
    },
    set skybox(value) {
        defaultSkybox.texture = value
    },

    get gridHelper() {
        return getGridHelper()
    },
    set gridHelper(value) {
        setGridHelper(value)
    },

    get gridHelperSize() {
        return getGridHelperSize()
    },
    set gridHelperSize(value) {
        setGridHelperSize(value)
    },

    get gravity() {
        return getGravity()
    },
    set gravity(value) {
        setGravity(value)
    },

    get repulsion() {
        return getRepulsion()
    },
    set repulsion(value) {
        setRepulsion(value)
    },

    get centripetal() {
        return getCentripetal()
    },
    set centripetal(value) {
        setCentripetal(value)
    },

    get antiAlias() {
        return getAntiAlias()
    },
    set antiAlias(value) {
        setAntiAlias(value)
    },

    get pixelRatio() {
        return getPixelRatio()
    },
    set pixelRatio(value) {
        setPixelRatio(value)
    },

    get fps() {
        return getFps()
    },
    set fps(value) {
        setFps(value)
    },

    get logarithmicDepth() {
        return getLogarithmicDepth()
    },
    set logarithmicDepth(value) {
        setLogarithmicDepth(value)
    },

    get exposure() {
        return getExposure()
    },
    set exposure(value) {
        setExposure(value)
    },

    get shadowResolution() {
        return getShadowResolution()
    },
    set shadowResolution(value) {
        setShadowResolution(value)
    },

    get shadowDistance() {
        return getShadowDistance()
    },
    set shadowDistance(value) {
        setShadowDistance(value)
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

    get bloomIntensity() {
        return getBloomIntensity()
    },
    set bloomIntensity(value) {
        setBloomIntensity(value)
    },

    get bloomThreshold() {
        return getBloomThreshold()
    },
    set bloomThreshold(value) {
        setBloomThreshold(value)
    },

    get bloomRadius() {
        return getBloomRadius()
    },
    set bloomRadius(value) {
        setBloomRadius(value)
    },

    get ssr() {
        return getSSR()
    },
    set ssr(value) {
        setSSR(value)
    },

    get ssrIntensity() {
        return getSSRIntensity()
    },
    set ssrIntensity(value) {
        setSSRIntensity(value)
    },

    get ssao() {
        return getSSAO()
    },
    set ssao(value) {
        setSSAO(value)
    },

    get ssaoIntensity() {
        return getSSAOIntensity()
    },
    set ssaoIntensity(value) {
        setSSAOIntensity(value)
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

    get texture() {
        return getBackgroundImage()
    },
    set texture(value) {
        setBackgroundImage(value)
    },

    get color() {
        return getBackgroundColor()
    },
    set color(value) {
        setBackgroundColor(value)
    }
}
