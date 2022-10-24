import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<AudioBuffer>((resolve, reject) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                loader.load(
                    url,
                    (buffer) => {
                        unpkg && decreaseLoadingUnpkgCount()
                        resolve(buffer)
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
