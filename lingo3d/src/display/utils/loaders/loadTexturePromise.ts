import { Texture } from "three"
import { forceGet } from "@lincode/utils"
import loadTexture from "./loadTexture"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"

const cache = new Map<string, Promise<Texture>>()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Texture>((resolve) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                const texture = loadTexture(url, () => {
                    unpkg && decreaseLoadingUnpkgCount()
                    resolve(texture)
                })
            })
    )
