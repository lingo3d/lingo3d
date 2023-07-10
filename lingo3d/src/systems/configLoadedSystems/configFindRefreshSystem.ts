import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import FoundManager from "../../display/core/FoundManager"
import { indexChildrenNames } from "../../memo/indexChildrenNames"
import { PropertyBinding } from "three"

export const configFindRefreshSystem = createLoadedEffectSystem(
    "configFindRefreshSystem",
    {
        effect: (self: FoundManager) => {
            self.$object = self.$innerObject = indexChildrenNames(
                self.owner!.$loadedObject!
            ).get(PropertyBinding.sanitizeNodeName(self.name!))!
            for (const child of self.children ?? [])
                "$object" in child && self.$innerObject.add(child.$object)
        },
        loading: (self) => {
            return !self.owner!.$loadedObject
        }
    }
)
