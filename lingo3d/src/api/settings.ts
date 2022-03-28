import { getFillWindow, setFillWindow } from "../states/useFillWindow"
import { getContainerSize, setContainerSize } from "../states/useContainerSize"
import { getPixelRatio, setPixelRatio } from "../states/usePixelRatio"
import { getResolutionScale, setResolutionScale } from "../states/useResolutionScale"
import { getViewportSize, setViewportSize } from "../states/useViewportSize"
import { getDefaultFog, setDefaultFog } from "../states/useDefaultFog"
import { DefaultLight, getDefaultLight, setDefaultLight } from "../states/useDefaultLight"
import { getGridHelper, setGridHelper } from "../states/useGridHelper"
import { getCameraHelper, setCameraHelper } from "../states/useCameraHelper"
import { getLightHelper, setLightHelper } from "../states/useLightHelper"
import { getPerformance, PerformanceValue, setPerformance } from "../states/usePerformance"
import { getOrbitControls, setOrbitControls } from "../states/useOrbitControls"

export default {
    get fillWindow() {
        return getFillWindow()
    },
    set fillWindow(value: boolean) {
        setFillWindow(value)
    },

    get width() {
        return getViewportSize()[0]
    },
    set width(val: number) {
        setViewportSize([val, getViewportSize()[1]])
    },
    get height() {
        return getViewportSize()[1]
    },
    set height(val: number) {
        setViewportSize([getViewportSize()[0], val])
    },

    get containerWidth() {
        return getContainerSize()[0]
    },
    set containerWidth(val: number) {
        setContainerSize([val, getContainerSize()[1]])
    },
    get containerHeight() {
        return getContainerSize()[1]
    },
    set containerHeight(val: number) {
        setContainerSize([getContainerSize()[0], val])
    },

    get pixelRatio() {
        return getPixelRatio()
    },
    set pixelRatio(value: number) {
        setPixelRatio(value)
    },
    
    get resolutionScale() {
        return getResolutionScale()
    },
    set resolutionScale(value: number) {
        setResolutionScale(value)
    },
    
    get performance() {
        return getPerformance()
    },
    set performance(value: PerformanceValue) {
        setPerformance(value)
    },

    get gridHelper() {
        return getGridHelper()
    },
    set gridHelper(value: boolean) {
        setGridHelper(value)
    },

    get cameraHelper() {
        return getCameraHelper()
    },
    set cameraHelper(value: boolean) {
        setCameraHelper(value)
    },

    get lightHelper() {
        return getLightHelper()
    },
    set lightHelper(value: boolean) {
        setLightHelper(value)
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

    get defaultOrbitControls() {
        return getOrbitControls()
    },
    set defaultOrbitControls(value: boolean) {
        setOrbitControls(value)
    },

    wasmPath: "https://www.lingo3d.com/wasm/",

    autoMout: true
}