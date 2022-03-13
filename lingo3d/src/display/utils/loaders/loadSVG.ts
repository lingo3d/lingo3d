import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Promise<SVGResult>>()
const loader = new SVGLoader()

export default (url: string) => forceGet(cache, url, () => new Promise<SVGResult>((resolve, reject) => {
    increaseLoadingCount()

    loader.load(url, svg => {
        decreaseLoadingCount()
        resolve(Object.freeze(svg))
    },
    undefined,
    () => {
        decreaseLoadingCount()
        reject()
    })
}))