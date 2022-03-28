import { debounce } from "@lincode/utils"
import { background, rendering, settings } from "../../.."
import { SetupNode } from "./types"

let defaults: Record<Exclude<keyof SetupNode, "type">, any> | undefined

export default debounce((node: Partial<SetupNode>) => {
    defaults ??= {
        performance: settings.performance,
        gridHelper: settings.gridHelper,
        cameraHelper: settings.cameraHelper,
        lightHelper: settings.lightHelper,
        defaultFog: settings.defaultFog,
        defaultLight: settings.defaultLight,
        defaultOrbitControls: settings.defaultOrbitControls,
    
        logarithmicDepth: rendering.logarithmicDepth,
        toneMapping: rendering.toneMapping,
        exposure: rendering.exposure,
        bloom: rendering.bloom,
        bloomStrength: rendering.bloomStrength,
        bloomRadius: rendering.bloomRadius,
        bloomThreshold: rendering.bloomThreshold,
        bokeh: rendering.bokeh,
        bokehFocus: rendering.bokehFocus,
        bokehMaxBlur: rendering.bokehMaxBlur,
        bokehAperture: rendering.bokehAperture,
        ambientOcclusion: rendering.ambientOcclusion,
    
        texture: background.texture,
        skybox: background.skybox,
        color: background.color
    }

    settings.performance = node.performance ?? defaults.performance
    settings.gridHelper = node.gridHelper ?? defaults.gridHelper
    settings.cameraHelper = node.cameraHelper ?? defaults.cameraHelper
    settings.lightHelper = node.lightHelper ?? defaults.lightHelper
    settings.defaultFog = node.defaultFog ?? defaults.defaultFog
    settings.defaultLight = node.defaultLight ?? defaults.defaultLight
    settings.defaultOrbitControls = node.defaultOrbitControls ?? defaults.defaultOrbitControls

    rendering.logarithmicDepth = node.logarithmicDepth ?? defaults.logarithmicDepth
    rendering.toneMapping = node.toneMapping ?? defaults.toneMapping
    rendering.exposure = node.exposure ?? defaults.exposure
    rendering.bloom = node.bloom ?? defaults.bloom
    rendering.bloomStrength = node.bloomStrength ?? defaults.bloomStrength
    rendering.bloomRadius = node.bloomRadius ?? defaults.bloomRadius
    rendering.bloomThreshold = node.bloomThreshold ?? defaults.bloomThreshold
    rendering.bokeh = node.bokeh ?? defaults.bokeh
    rendering.bokehFocus = node.bokehFocus ?? defaults.bokehFocus
    rendering.bokehMaxBlur = node.bokehMaxBlur ?? defaults.bokehMaxBlur
    rendering.bokehAperture = node.bokehAperture ?? defaults.bokehAperture
    rendering.ambientOcclusion = node.ambientOcclusion ?? defaults.ambientOcclusion

    background.texture = node.texture ?? defaults.texture
    background.skybox = node.skybox ?? defaults.skybox
    background.color = node.color ?? defaults.color
    
}, 0, "trailing")