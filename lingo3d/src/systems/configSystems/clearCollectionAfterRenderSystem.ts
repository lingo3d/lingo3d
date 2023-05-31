import createSystem from "../utils/createSystem"

export const clearCollectionAfterRenderSystem = createSystem(
    "clearCollectionAfterRenderSystem",
    {
        effect: (collection: Map<any, any> | Set<any>) => collection.clear(),
        effectTicker: "afterRender"
    }
)
