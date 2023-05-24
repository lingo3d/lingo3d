import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { handleProgress } from "./utils/bytesLoaded"
import { assetsPathPtr } from "../../../pointers/assetsPathPointers"

const cache = new Map<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<AudioBuffer>((resolve, reject) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                loader.load(
                    url,
                    (buffer) => {
                        isAssets && decreaseLoadingAssetsCount()
                        resolve(buffer)
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
