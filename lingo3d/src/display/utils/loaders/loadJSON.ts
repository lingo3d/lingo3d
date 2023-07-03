import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { busyCountPtr } from "../../../pointers/busyCountPtr"
import { createMap } from "../../../utils/createCollection"

const cache = createMap<string, Promise<Record<string, any> | Array<any>>>()
const loader = new FileLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
                busyCountPtr[0]++
                loader.load(
                    url,
                    (data) => {
                        try {
                            assert(typeof data === "string")
                            const parsed = JSON.parse(data)
                            busyCountPtr[0]--
                            resolve(parsed as any)
                        } catch {}
                    },
                    handleProgress(url),
                    () => {
                        busyCountPtr[0]--
                        reject()
                    }
                )
            })
    )
