import { debounce } from "@lincode/utils"

export default () => {
    const map = new Map<any, () => void>()
    const run = debounce(
        () => {
            for (const cb of map.values()) cb()
            map.clear()
        },
        0,
        "trailing"
    )
    return (item: any, cb: () => void) => {
        map.set(item, cb)
        run()
    }
}
