import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const cache = createUnloadMap<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<AudioBuffer>((resolve, reject) => {
                addBusyProcess("loadAudio")
                loader.load(
                    url,
                    (buffer) => {
                        deleteBusyProcess("loadAudio")
                        resolve(buffer)
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadAudio")
                        reject()
                    }
                )
            })
    )
