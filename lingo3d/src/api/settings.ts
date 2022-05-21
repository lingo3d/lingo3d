import { getPixelRatio, setPixelRatio } from "../states/usePixelRatio"
import { getDefaultFog, setDefaultFog } from "../states/useDefaultFog"
import { getDefaultLight, setDefaultLight } from "../states/useDefaultLight"
import { getPerformance, setPerformance } from "../states/usePerformance"
import { getOrbitControls, setOrbitControls } from "../states/useOrbitControls"
import { getGravity, setGravity } from "../states/useGravity"
import { getRepulsion, setRepulsion } from "../states/useRepulsion"
import { getDefaultLightScale, setDefaultLightScale } from "../states/useDefaultLightScale"
import { getGridHelper, setGridHelper } from "../states/useGridHelper"
import { getGridHelperSize, setGridHelperSize } from "../states/useGridHelperSize"
import { getAmbientOcclusion, setAmbientOcclusion } from "../states/useAmbientOcclusion"
import { getBloom, setBloom } from "../states/useBloom"
import { getBloomRadius, setBloomRadius } from "../states/useBloomRadius"
import { getBloomStrength, setBloomStrength } from "../states/useBloomStrength"
import { getBloomThreshold, setBloomThreshold } from "../states/useBloomThreshold"
import { getEncoding, setEncoding } from "../states/useEncoding"
import { getExposure, setExposure } from "../states/useExposure"
import { getLensBand, setLensBand } from "../states/useLensBand"
import { getLensDistortion, setLensDistortion } from "../states/useLensDistortion"
import { getLensIor, setLensIor } from "../states/useLensIor"
import { getLogarithmicDepth, setLogarithmicDepth } from "../states/useLogarithmicDepth"
import { getOutlineColor, setOutlineColor } from "../states/useOutlineColor"
import { getOutlineHiddenColor, setOutlineHiddenColor } from "../states/useOutlineHiddenColor"
import { getOutlinePattern, setOutlinePattern } from "../states/useOutlinePattern"
import { getOutlinePulse, setOutlinePulse } from "../states/useOutlinePulse"
import { getOutlineStrength, setOutlineStrength } from "../states/useOutlineStrength"
import { getOutlineThickness, setOutlineThickness } from "../states/useOutlineThickness"
import { getPBR, setPBR } from "../states/usePBR"
import { getBackgroundColor, setBackgroundColor } from "../states/useBackgroundColor"
import { getBackgroundImage, setBackgroundImage } from "../states/useBackgroundImage"
import Skybox from "../display/Skybox"
import { appendableRoot } from "./core/Appendable"

const defaultSkybox = new Skybox()
appendableRoot.delete(defaultSkybox)

export default {
    //general
    get pixelRatio() {
        return getPixelRatio()
    },
    set pixelRatio(value: number) {
        setPixelRatio(value)
    },
    
    get performance() {
        return getPerformance()
    },
    set performance(value) {
        setPerformance(value)
    },

    get defaultFog() {
        return getDefaultFog()
    },
    set defaultFog(value) {
        setDefaultFog(value)
    },

    get defaultLight() {
        return getDefaultLight()
    },
    set defaultLight(value) {
        setDefaultLight(value)
    },

    get defaultLightScale() {
        return getDefaultLightScale()
    },
    set defaultLightScale(value) {
        setDefaultLightScale(value)
    },

    get skybox() {
        return defaultSkybox.texture
    },
    set skybox(value: string | Array<string> | undefined) {
        defaultSkybox.texture = value
    },

    get defaultOrbitControls() {
        return getOrbitControls()
    },
    set defaultOrbitControls(value) {
        setOrbitControls(value)
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

    wasmPath: "https://unpkg.com/lingo3d-wasm@1.0.0/assets/",
  
    autoMount: false as boolean | string,

    //rendering
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

    get lensIor() {
        return getLensIor()
    },
    set lensIor(val) {
        setLensIor(val)
    },

    get lensBand() {
        return getLensBand()
    },
    set lensBand(val) {
        setLensBand(val)
    },

    //background
    get texture() {
        return getBackgroundImage()
    },
    set texture(value: string | undefined) {
        setBackgroundImage(value)
    },

    get color() {
        return getBackgroundColor()
    },
    set color(value: string) {
        setBackgroundColor(value)
    }
}