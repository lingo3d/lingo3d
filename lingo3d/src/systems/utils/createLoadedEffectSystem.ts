import Appendable from "../../display/core/Appendable"
import Loaded from "../../display/core/Loaded"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

const _loading = (self: Appendable | Loaded | object) =>
    "$loadedObject" in self && !self.$loadedObject

export const createLoadedEffectSystem = <
    GameObject extends Appendable | Loaded | object,
    Data extends Record<string, any> | void
>(
    name: string,
    {
        data,
        effect,
        cleanup,
        effectTicker,
        loading = _loading
    }: Pick<
        SystemOptions<GameObject, Data, void>,
        "data" | "effect" | "cleanup" | "effectTicker"
    > & { loading?: (self: GameObject) => boolean }
) => {
    const effectSystem = createInternalSystem(name, {
        data,
        effect,
        cleanup,
        effectTicker
    })
    const addSystem = createInternalSystem(name + "Add", {
        update: (self: GameObject) => {
            if (loading(self)) return
            addSystem.delete(self)
            effectSystem.add(self)
        }
    })
    return {
        add: (item: GameObject) => {
            if (loading(item)) {
                addSystem.add(item)
                return
            }
            effectSystem.add(item)
        },
        delete: (item: GameObject) => {
            addSystem.delete(item)
            effectSystem.delete(item)
        }
    }
}
