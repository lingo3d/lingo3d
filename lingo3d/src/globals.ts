export const PI = Math.PI
export const PI2 = PI * 2
export const PI_HALF = PI * 0.5

export const CM2M = 1 / 100
export const M2CM = 100

export const WIDTH = 375
export const HEIGHT = 667
export const MONITOR_INTERVAL = 100

export const SEC2FRAME = 60
export const FRAME2SEC = 1 / SEC2FRAME

export const MIN_POLAR_ANGLE = 5
export const MAX_POLAR_ANGLE = 175
export const ORTHOGRAPHIC_FRUSTUM = 5.7
export const NEAR = 0.1
export const FAR = 1000
export const SHADOW_BIAS = -0.0055

const STATIC_URL =
    "http://ec2-69-230-242-89.cn-northwest-1.compute.amazonaws.com.cn:8080/"

export const DUMMY_URL = STATIC_URL + "dummy/"
export const YBOT_URL = DUMMY_URL + "ybot.fbx"
export const TEXTURES_URL = STATIC_URL + "textures/"
export const WATERNORMALS_URL = TEXTURES_URL + "waternormals.jpg"
export const EDITOR_URL = STATIC_URL + "editor/"
export const WASM_URL = STATIC_URL + "wasm/"

export const FACADE_URL = "https://unpkg.com/lingo3d-facade@1.0.0/assets/"
export const FOREST_URL = "https://unpkg.com/lingo3d-forest@1.0.0/assets/"

export const DEBUG = false
export const VERSION = "2.0.3"

export const FRAME_WIDTH = 12
export const FRAME_HEIGHT = FRAME_WIDTH * 2
export const FRAME_MAX = Number.MAX_SAFE_INTEGER / FRAME_WIDTH
export const APPBAR_HEIGHT = 28
export const PANELS_HEIGHT = 200
export const CONTEXT_MENU_ITEM_HEIGHT = 25
export const LIBRARY_WIDTH = 200
export const EDITOR_WIDTH = 300
