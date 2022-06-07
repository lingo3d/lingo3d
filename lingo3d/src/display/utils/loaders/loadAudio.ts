import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) => forceGet(cache, url, () => new Promise<AudioBuffer>((resolve, reject) => {
    increaseLoadingCount()

    loader.load(url, buffer => {
        decreaseLoadingCount()
        resolve(Object.freeze(buffer))
    },
    handleProgress,
    () => {
        decreaseLoadingCount()
        reject()
    })
}))