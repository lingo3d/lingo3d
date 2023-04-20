import { forceGetInstance } from "@lincode/utils"
import { addClearSystem } from "../../systems/configSystems/clearSystem"

export default <Item extends object, Item2 extends object, Return>(
    cb: (item: Item, item2: Item2) => Return
) => {
    const cache = new WeakMap<Item, Map<Item2, Return>>()
    return (item: Item, item2: Item2): Return => {
        const cache2 = forceGetInstance(cache, item, Map<Item2, Return>)
        if (cache2.has(item2)) return cache2.get(item2)!
        const result = cb(item, item2)
        cache2.set(item2, result)
        addClearSystem(cache2)
        return result
    }
}
