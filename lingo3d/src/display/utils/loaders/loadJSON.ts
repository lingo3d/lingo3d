import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<Record<string, any> | Array<any>>>()
const loader = new FileLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                loader.load(
                    url,
                    (data) => {
                        try {
                            assert(typeof data === "string")
                            const parsed = JSON.parse(data)
                            unpkg && decreaseLoadingUnpkgCount()
                            resolve(parsed)
                        } catch {}
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
