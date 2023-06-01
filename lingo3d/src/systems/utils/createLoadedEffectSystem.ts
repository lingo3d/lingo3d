import MeshAppendable from "../../display/core/MeshAppendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export const createLoadedEffectSystem = <
    GameObject extends MeshAppendable,
    Data extends Record<string, any> | void
>(
    name: string,
    { data, effect, cleanup }: SystemOptions<GameObject, Data>
) => {
    const effectSystem = createInternalSystem(name, {
        data,
        effect,
        cleanup
    })
    const addSystem = createInternalSystem(name + "Add", {
        data,
        update: (self, data) => {
            if ("$loadedObject3d" in self && !self.$loadedObject3d) return
            addSystem.delete(self)
            effectSystem.add(self, data)
        }
    })
    return { add: addSystem.add }
}
