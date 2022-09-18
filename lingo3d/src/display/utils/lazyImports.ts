import { lazy } from "@lincode/utils"

export const makeLazyImport = <T>(importWrapper: () => Promise<T>) =>
    lazy(() => importWrapper())

export const lazyImportLoadFBX = makeLazyImport(
    () => import("./loaders/loadFBX")
)
export const lazyImportLoadGLTF = makeLazyImport(
    () => import("./loaders/loadGLTF")
)
export const lazyImportLoadSVG = makeLazyImport(
    () => import("./loaders/loadSVG")
)
