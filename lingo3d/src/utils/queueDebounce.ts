import { debounceTrailing } from "@lincode/utils"

export default () => {
    const map = new Map<any, () => void>()
    const run = debounceTrailing(() => {
        for (const cb of map.values()) cb()
        map.clear()
    })
    return (item: any, cb: () => void) => {
        map.set(item, cb)
        run()
    }
}
