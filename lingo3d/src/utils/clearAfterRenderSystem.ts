import renderSystem from "./renderSystem"

export const [addClearAfterRenderSystem] = renderSystem(
    (collection: Map<any, any> | Set<any>) => collection.clear()
)
