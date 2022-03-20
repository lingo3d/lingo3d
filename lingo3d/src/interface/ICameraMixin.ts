export default interface ICameraMixin {
    fov: number
    zoom: number
    near: number
    far: number
    active: boolean
    bokeh: boolean
    bokehFocus: number
    bokehMaxBlur: number
    bokehAperture: number
}