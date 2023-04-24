import configLoadedSystem from "../utils/configLoadedSystem"

export const [addConfigCastShadowSystem] = configLoadedSystem((self) => {
    const bool = !!self.castShadow
    self.outerObject3d.traverse((child) => (child.castShadow = bool))
})
