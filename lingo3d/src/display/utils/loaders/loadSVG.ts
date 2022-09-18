import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<SVGResult>>()
const loader = new SVGLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<SVGResult>((resolve, reject) => {
                loader.load(
                    url,
                    (svg) => resolve(Object.freeze(svg)),
                    handleProgress(url),
                    reject
                )
            })
    )
