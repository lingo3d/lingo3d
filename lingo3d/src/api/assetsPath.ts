import { lazy } from "@lincode/utils"

let assetsPath =
    "http://ec2-69-230-242-89.cn-northwest-1.compute.amazonaws.com.cn:8080/"

export const setAssetsPath = (val: string) => (assetsPath = val)

setAssetsPath("assets/")

const STATIC_URL = lazy(() => assetsPath)

export const DUMMY_URL = lazy(() => STATIC_URL() + "dummy/")
export const YBOT_URL = lazy(() => DUMMY_URL() + "ybot.fbx")
export const TEXTURES_URL = lazy(() => STATIC_URL() + "textures/")
export const WATERNORMALS_URL = lazy(() => TEXTURES_URL() + "waternormals.jpg")
export const EDITOR_URL = lazy(() => STATIC_URL() + "editor/")
export const WASM_URL = lazy(() => STATIC_URL() + "wasm/")

export const FACADE_URL = lazy(
    () => "https://unpkg.com/lingo3d-facade@1.0.0/assets/"
)
export const FOREST_URL = lazy(
    () => "https://unpkg.com/lingo3d-forest@1.0.0/assets/"
)
