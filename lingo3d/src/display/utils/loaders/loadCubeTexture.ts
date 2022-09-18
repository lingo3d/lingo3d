import { CubeTextureLoader, Texture } from "three"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Texture>()
const loader = new CubeTextureLoader()

export default (urls: Array<string>) =>
    forceGet(cache, urls.join(","), () =>
        loader.load(urls, undefined, handleProgress(urls.join(",")))
    )
