import Model from "../../display/Model"
import FoundManager from "../../display/core/FoundManager"
import { indexChildrenNames } from "../../memo/indexChildrenNames"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import { configFactorsSystem } from "./configFactorsSystem"

export const configModelSrcSystem = createLoadedEffectSystem(
    "configModelSrcSystem",
    {
        data: { reload: false },
        effect: (self: Model, data) => {
            if (!data.reload) return

            configFactorsSystem.add(self)

            // reconfigure FoundManagers to point towards objects in the new model
            const childrenNames = indexChildrenNames(self.$loadedObject!)
            for (const child of self.children ?? []) {
                if (!(child instanceof FoundManager)) continue
                child.$object = child.$innerObject = childrenNames.get(
                    child.name!
                )!
                for (const _child of child.children ?? [])
                    "$object" in _child && child.$object.add(_child.$object)
            }
        },
        cleanup: (_, data) => {
            data.reload = true
        }
    }
)
