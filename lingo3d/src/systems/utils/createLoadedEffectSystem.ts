import Appendable from "../../display/core/Appendable"
import Loaded from "../../display/core/Loaded"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export const createLoadedEffectSystem = <
    GameObject extends Appendable | Loaded,
    Data extends Record<string, any> | void
>(
    name: string,
    {
        data,
        effect,
        cleanup,
        effectTicker,
        loading = (self: GameObject) =>
            "$loadedObject3d" in self && !self.$loadedObject3d
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
        data,
        update: (self, data) => {
            if (loading(self)) return
            addSystem.delete(self)
            effectSystem.add(self, data)
        }
    })
    return {
        add: (item: GameObject, initData?: Data) => {
            if (loading(item)) {
                addSystem.add(item, initData)
                return
            }
            effectSystem.add(item, initData)
        }
    }
}
