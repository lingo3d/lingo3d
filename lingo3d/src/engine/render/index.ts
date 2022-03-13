import { createEffect } from "@lincode/reactivity"
import { preventTreeShake } from "@lincode/utils"
import { getCamera } from "../../states/useCamera"
import { getPerformance } from "../../states/usePerformance"
import { setSelectiveBloom } from "../../states/useSelectiveBloom"
import { setSSR } from "../../states/useSSR"
import { loop } from "../eventLoop"
import scene from "../scene"
import effectComposer from "./effectComposer"
import renderSelectiveBloom, { bloomPtr } from "./effectComposer/selectiveBloomPass/renderSelectiveBloom"
import { ssrPtr } from "./effectComposer/ssrPass"
import { renderer } from "./renderer"
import resize from "./resize"

preventTreeShake(resize)

export default {}

let getBlob: ((blob: Blob) => void) | undefined

export const toBlob = () => new Promise<Blob>(resolve => getBlob = resolve)

const handleBlob = () => {
    if (!getBlob) return
    const getBlobCopy = getBlob
    getBlob = undefined
    renderer.domElement.toBlob(blob => blob && getBlobCopy(blob))
}

createEffect(() => {
    if (getPerformance() === "speed") {
        const handle = loop(() => {
            renderer.render(scene, getCamera())
            handleBlob()
        })
        return () => {
            handle.cancel()
        }
    }
    let selectiveBloomInitialized = false
    let ssrInitialized = false

    const handle = loop(() => {
        if (bloomPtr[0]) {
            if (!selectiveBloomInitialized) {
                setSelectiveBloom(true)
                selectiveBloomInitialized = true
            }
            renderSelectiveBloom()
        }
        if (ssrPtr[0] && !ssrInitialized) {
            setSSR(true)
            ssrInitialized = true
        }
        effectComposer.render()
        handleBlob()
    })
    return () => {
        handle.cancel()
    }
}, [getPerformance])

