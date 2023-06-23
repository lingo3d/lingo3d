import Loaded from "../../display/core/Loaded"
import MeshAppendable from "../../display/core/MeshAppendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export const createLoadedEffectSystem = <
    GameObject extends MeshAppendable | Loaded,
    Data extends Record<string, any> | void
>(
    name: string,
    {
        data,
        effect,
        cleanup,
        effectTicker
    }: Pick<
        SystemOptions<GameObject, Data, void>,
        "data" | "effect" | "cleanup" | "effectTicker"
    >
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
            if ("$loadedObject3d" in self && !self.$loadedObject3d) return
            addSystem.delete(self)
            effectSystem.add(self, data)
        }
    })
    return {
        add: (item: GameObject, initData?: Data) => {
            if ("$loadedObject3d" in item && !item.$loadedObject3d) {
                addSystem.add(item, initData)
                return
            }
            effectSystem.add(item, initData)
        }
    }
}
