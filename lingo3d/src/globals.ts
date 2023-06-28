import "./engine/polyfill"

export const PI = Math.PI
export const PI2 = PI * 2
export const PI_HALF = PI * 0.5

export const CM2M = 1 / 100
export const M2CM = 100

export const WIDTH = 375
export const HEIGHT = 667

export const STANDARD_FRAME = 60
export const INVERSE_STANDARD_FRAME = 1 / STANDARD_FRAME

export const CLICK_TIME = 300

export const MIN_POLAR_ANGLE = 5
export const MAX_POLAR_ANGLE = 175
export const ORTHOGRAPHIC_FRUSTUM = 5.7
export const NEAR = 0.1
export const FAR = 1000
export const SHADOW_BIAS = -0.0055

export const POINTLIGHT_DISTANCE = 800
export const POINTLIGHT_INTENSITY = 4

export const DEBUG = false
export const VERSION = "2.1.1-alpha.5"
export const USE_RUNTIME = true

export const FRAME_WIDTH = 12
export const FRAME_HEIGHT = FRAME_WIDTH * 2
export const FRAME_MAX = Number.MAX_SAFE_INTEGER / FRAME_WIDTH
export const APPBAR_HEIGHT = 28
export const PANELS_HEIGHT = 200
export const LIBRARY_WIDTH = 200
export const TREE_ITEM_HEIGHT = 18
export const BACKGROUND_COLOR = "#121316"

export const IS_MOBILE = (() => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return true
    } else if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return true
    }
    return false
})()
