import { assert, forceGet } from "@lincode/utils"
import { FileLoader } from "three"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Promise<Record<string, any> | Array<any>>>()
const loader = new FileLoader()

export default (url: string) => forceGet(cache, url, () => new Promise<Record<string, any> | Array<any>>((resolve, reject) => {
    increaseLoadingCount()

    loader.load(url, data => {
        decreaseLoadingCount()

        try {
            assert(typeof data === "string")
            resolve(Object.freeze(JSON.parse(data)))
        }
        catch {}
    },
    undefined,
    () => {
        decreaseLoadingCount()
        reject()
    })
}))