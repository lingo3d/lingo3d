import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { handleProgress } from "./utils/bytesLoaded"
import { assetsPathPtr } from "../../../pointers/assetsPathPointers"

const cache = new Map<string, Promise<Record<string, any> | Array<any>>>()
const loader = new FileLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                loader.load(
                    url,
                    (data) => {
                        try {
                            assert(typeof data === "string")
                            const parsed = JSON.parse(data)
                            isAssets && decreaseLoadingAssetsCount()
                            resolve(parsed as any)
                        } catch {}
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
