import MeshAppendable from "../../display/core/MeshAppendable"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export const createLoadedEffectSystem = <
    GameObject extends MeshAppendable,
    Data extends Record<string, any> | void
>(
    name: string,
    { data, effect }: SystemOptions<GameObject, Data>
) => {
    const system = createInternalSystem(name, {
        data,
        update: effect
            ? (self, data) => {
                  if ("$loadedObject3d" in self && !self.$loadedObject3d) return
                  system.delete(self)
                  effect(self, data)
              }
            : undefined
    })
    return system
}
