import { getPixelRatio, setPixelRatio } from "../states/usePixelRatio"
import { getViewportSize, setViewportSize } from "../states/useViewportSize"
import { getDefaultFog, setDefaultFog } from "../states/useDefaultFog"
import { DefaultLight, getDefaultLight, setDefaultLight } from "../states/useDefaultLight"
import { getPerformance, PerformanceValue, setPerformance } from "../states/usePerformance"
import { getOrbitControls, setOrbitControls } from "../states/useOrbitControls"
import { getResolution, setResolution } from "../states/useResolution"
import { getGravity, setGravity } from "../states/useGravity"
import { getMapPhysics, setMapPhysics } from "../states/useMapPhysics"
import { getDefaultLightScale, setDefaultLightScale } from "../states/useDefaultLightScale"

export default {
    get viewportSize() {
        return getViewportSize()
    },
    set viewportSize(val: [number, number]) {
        setViewportSize(val)
    },

    get resolution() {
        return getResolution()
    },
    set resolution(val: [number, number]) {
        setResolution(val)
    },

    get pixelRatio() {
        return getPixelRatio()
    },
    set pixelRatio(value: number) {
        setPixelRatio(value)
    },
    
    get performance() {
        return getPerformance()
    },
    set performance(value: PerformanceValue) {
        setPerformance(value)
    },

    get defaultFog() {
        return getDefaultFog()
    },
    set defaultFog(value: boolean) {
        setDefaultFog(value)
    },

    get defaultLight() {
        return getDefaultLight()
    },
    set defaultLight(value: DefaultLight) {
        setDefaultLight(value)
    },

    get defaultLightScale() {
        return getDefaultLightScale()
    },
    set defaultLightScale(value: number) {
        setDefaultLightScale(value)
    },

    get defaultOrbitControls() {
        return getOrbitControls()
    },
    set defaultOrbitControls(value: boolean) {
        setOrbitControls(value)
    },

    get gravity() {
        return getGravity()
    },
    set gravity(value: number) {
        setGravity(value)
    },

    get mapPhysics() {
        return getMapPhysics()
    },
    set mapPhysics(value: number) {
        setMapPhysics(value)
    },

    wasmPath: "https://unpkg.com/lingo3d-wasm@1.0.0/assets/",
  
    autoMount: false
}