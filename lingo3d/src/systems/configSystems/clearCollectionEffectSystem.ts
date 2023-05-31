import createInternalSystem from "../utils/createInternalSystem"

export const clearCollectionEffectSystem = createInternalSystem(
    "clearCollectionAfterRenderSystem",
    {
        effect: (collection: Map<any, any> | Set<any>) => collection.clear(),
        effectTicker: "afterRender"
    }
)
