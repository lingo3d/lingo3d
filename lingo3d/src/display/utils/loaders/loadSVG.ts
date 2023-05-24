import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { assetsPathPtr } from "../../../pointers/assetsPathPointers"

const cache = new Map<string, Promise<SVGResult>>()
export const loader = new SVGLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<SVGResult>((resolve, reject) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                loader.load(
                    url,
                    (svg) => {
                        isAssets && decreaseLoadingAssetsCount()
                        resolve(svg)
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
