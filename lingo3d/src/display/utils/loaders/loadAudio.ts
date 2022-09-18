import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<AudioBuffer>((resolve, reject) => {
                loader.load(
                    url,
                    (buffer) => resolve(Object.freeze(buffer)),
                    handleProgress(url),
                    reject
                )
            })
    )
