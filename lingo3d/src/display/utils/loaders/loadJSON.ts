import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const cache = createUnloadMap<
    string,
    Promise<Record<string, any> | Array<any>>
>()
const loader = new FileLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
                addBusyProcess("loadJSON")
                loader.load(
                    url,
                    (data) => {
                        try {
                            assert(typeof data === "string")
                            const parsed = JSON.parse(data)
                            deleteBusyProcess("loadJSON")
                            resolve(parsed as any)
                        } catch {}
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadJSON")
                        reject()
                    }
                )
            })
    )
