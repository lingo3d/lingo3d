import { lazy } from "@lincode/utils"

export const lazyLoadFBX = lazy(() => import("./loadFBX"))
export const lazyLoadGLTF = lazy(() => import("./loadGLTF"))