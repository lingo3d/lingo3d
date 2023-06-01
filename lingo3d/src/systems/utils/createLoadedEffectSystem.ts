import Loaded from "../../display/core/Loaded"
import createInternalSystem, { SystemOptions } from "./createInternalSystem"

export const createLoadedEffectSystem = <
    GameObject extends Loaded,
    Data extends Record<string, any> | void
>(
    name: string,
    { data, effect }: SystemOptions<GameObject, Data>
) => {
    const system = createInternalSystem(name, {
        data,
        update: effect
            ? (self, data) => {
                  if (!self.$loadedObject3d) return
                  system.delete(self)
                  effect(self, data)
              }
            : undefined
    })
    return system
}
