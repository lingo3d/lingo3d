import Appendable from "../../display/core/Appendable"
import Loaded from "../../display/core/Loaded"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

const _loading = (self: any) =>
    "$loadedObject3d" in self && !self.$loadedObject3d

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
    > & { loading?: (self: GameObject, data: Data) => boolean }
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
            if (loading(self, data)) return
            addSystem.delete(self)
            effectSystem.add(self, data)
        }
    })
    return {
        add: (item: GameObject, initData?: Data) => {
            if (loading(item, initData!)) {
                addSystem.add(item, initData)
                return
            }
            effectSystem.add(item, initData)
        },
        delete: (item: GameObject) => {
            addSystem.delete(item)
            effectSystem.delete(item)
        }
    }
}
