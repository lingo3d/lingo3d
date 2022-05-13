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

export default {
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
  
    autoMount: false as boolean | string
}