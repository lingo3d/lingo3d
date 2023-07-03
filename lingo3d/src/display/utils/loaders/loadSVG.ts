import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { busyCountPtr } from "../../../pointers/busyCountPtr"
import createMap from "../../../utils/createMap"

const cache = createMap<string, Promise<SVGResult>>()
export const loader = new SVGLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<SVGResult>((resolve, reject) => {
                busyCountPtr[0]++
                loader.load(
                    url,
                    (svg) => {
                        busyCountPtr[0]--
                        resolve(svg)
                    },
                    handleProgress(url),
                    () => {
                        busyCountPtr[0]--
                        reject()
                    }
                )
            })
    )
