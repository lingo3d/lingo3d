import { lazy } from "@lincode/utils"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../../states/useLoadingCount"

export const makeLazyImport = <T>(importWrapper: () => Promise<T>) =>
    lazy(() => {
        increaseLoadingCount()
        const module = importWrapper()
        decreaseLoadingCount()
        return module
    })

export const lazyImportLoadFBX = makeLazyImport(
    () => import("./loaders/loadFBX")
)
export const lazyImportLoadGLTF = makeLazyImport(
    () => import("./loaders/loadGLTF")
)
export const lazyImportLoadSVG = makeLazyImport(
    () => import("./loaders/loadSVG")
)
