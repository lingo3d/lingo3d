import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"
import FoundManager from "../../display/core/FoundManager"
import { indexChildrenNames } from "../../memo/indexChildrenNames"
import { PropertyBinding } from "three"

export const configFindRefreshSystem = createLoadedEffectSystem(
    "configFindRefreshSystem",
    {
        effect: (self: FoundManager) => {
            self.object3d = indexChildrenNames(
                self.owner!.$loadedObject3d!
            ).get(PropertyBinding.sanitizeNodeName(self.name!))!
            for (const child of self.children ?? [])
                "outerObject3d" in child &&
                    self.object3d.add(child.outerObject3d)
        },
        loading: (self) => {
            return !self.owner!.$loadedObject3d
        }
    }
)
