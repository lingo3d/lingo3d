import store from "@lincode/reactivity"

export const [setSkyShaderOptions, getSkyShaderOptions] = store({
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.5,
    inclination: 0.49,
    azimuth: 0.25
})