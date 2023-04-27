import { NearestFilter, WebGLRenderTarget } from "three"
import createObjectPool from "../utils/createObjectPool"

const pars = {
    minFilter: NearestFilter,
    magFilter: NearestFilter
}

export const [requestShadowRenderTarget, releaseShadowRenderTarget] =
    createObjectPool<WebGLRenderTarget, [number]>(
        (params) => new WebGLRenderTarget(params[0], params[0], pars)
    )
