import { Texture } from "three"
import { forceGet } from "@lincode/utils"
import loadTexture from "./loadTexture"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { assetsPathPtr } from "../../../pointers/assetsPathPtr"

const cache = new Map<string, Promise<Texture>>()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Texture>((resolve) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                const texture = loadTexture(url, () => {
                    isAssets && decreaseLoadingAssetsCount()
                    resolve(texture)
                })
            })
    )
