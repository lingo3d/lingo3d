import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const cache = createUnloadMap<string, Promise<SVGResult>>()
export const loader = new SVGLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<SVGResult>((resolve, reject) => {
                addBusyProcess("loadSVG")
                loader.load(
                    url,
                    (svg) => {
                        deleteBusyProcess("loadSVG")
                        resolve(svg)
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadSVG")
                        reject()
                    }
                )
            })
    )
