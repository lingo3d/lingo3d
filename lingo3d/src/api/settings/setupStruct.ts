import Skybox from "../../display/Skybox"
import {
    getBackgroundColor,
    setBackgroundColor
} from "../../states/useBackgroundColor"
import {
    getBackgroundImage,
    setBackgroundImage
} from "../../states/useBackgroundImage"
import { getBloom, setBloom } from "../../states/useBloom"
import {
    getBloomIntensity,
    setBloomIntensity
} from "../../states/useBloomIntensity"
import {
    getBloomThreshold,
    setBloomThreshold
} from "../../states/useBloomThreshold"
import { getDefaultLight, setDefaultLight } from "../../states/useDefaultLight"
import { getExposure, setExposure } from "../../states/useExposure"
import { getGrid, setGrid } from "../../states/useGrid"
import { getOutlineColor, setOutlineColor } from "../../states/useOutlineColor"
import {
    getOutlineHiddenColor,
    setOutlineHiddenColor
} from "../../states/useOutlineHiddenColor"
import {
    getOutlinePattern,
    setOutlinePattern
} from "../../states/useOutlinePattern"
import { getOutlinePulse, setOutlinePulse } from "../../states/useOutlinePulse"
import {
    getOutlineStrength,
    setOutlineStrength
} from "../../states/useOutlineStrength"
import { getFps, setFps } from "../../states/useFps"
import { getSSR, setSSR } from "../../states/useSSR"
import { getSSRIntensity, setSSRIntensity } from "../../states/useSSRIntensity"
import { getSSAO, setSSAO } from "../../states/useSSAO"
import { getBloomRadius, setBloomRadius } from "../../states/useBloomRadius"
import { getEnvironment, setEnvironment } from "../../states/useEnvironment"
import { getStats, setStats } from "../../states/useStats"
import { getBokeh, setBokeh } from "../../states/useBokeh"
import { getBokehScale, setBokehScale } from "../../states/useBokehScale"
import { getVignette, setVignette } from "../../states/useVignette"
import { getGravity, setGravity } from "../../states/useGravity"
import { getSSRJitter, setSSRJitter } from "../../states/useSSRJitter"
import { lightDistancePtr } from "../../pointers/lightDistancePtr"
import { CM2M, M2CM } from "../../globals"
import { computeLightIncrement } from "../../pointers/lightIncrementPtr"
import {
    getSSAOIntensity,
    setSSAOIntensity
} from "../../states/useSSAOIntensity"
import { getSSAORadius, setSSAORadius } from "../../states/useSSAORadius"
import {
    getPointLightPool,
    setPointLightPool
} from "../../states/usePointLightPool"
import {
    getSpotLightPool,
    setSpotLightPool
} from "../../states/useSpotLightPool"

const defaultSkybox = new Skybox()
defaultSkybox.remove()

export default {
    get defaultLight() {
        return getDefaultLight()
    },
    set defaultLight(value) {
        setDefaultLight(value)
    },

    get lightDistance() {
        return lightDistancePtr[0] * M2CM
    },
    set lightDistance(value) {
        lightDistancePtr[0] = value * CM2M
        computeLightIncrement()
    },

    get pointLightPool() {
        return getPointLightPool()
    },
    set pointLightPool(value) {
        setPointLightPool(value)
    },

    get spotLightPool() {
        return getSpotLightPool()
    },
    set spotLightPool(value) {
        setSpotLightPool(value)
    },

    get environment() {
        return getEnvironment()
    },
    set environment(value) {
        setEnvironment(value)
    },

    get skybox() {
        return defaultSkybox.texture
    },
    set skybox(value) {
        defaultSkybox.texture = value
    },

    get grid() {
        return getGrid()
    },
    set grid(value) {
        setGrid(value)
    },

    get stats() {
        return getStats()
    },
    set stats(value) {
        setStats(value)
    },

    get fps() {
        return getFps()
    },
    set fps(value) {
        setFps(value)
    },

    get gravity() {
        return getGravity()
    },
    set gravity(value) {
        setGravity(value)
    },

    get exposure() {
        return getExposure()
    },
    set exposure(value) {
        setExposure(value)
    },

    get bokehScale() {
        return getBokehScale()
    },
    set bokehScale(value) {
        setBokehScale(value)
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

    get ssrJitter() {
        return getSSRJitter()
    },
    set ssrJitter(value) {
        setSSRJitter(value)
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

    get ssaoRadius() {
        return getSSAORadius()
    },
    set ssaoRadius(value) {
        setSSAORadius(value)
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

    get bokeh() {
        return getBokeh()
    },
    set bokeh(value) {
        setBokeh(value)
    },

    get vignette() {
        return getVignette()
    },
    set vignette(value) {
        setVignette(value)
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
