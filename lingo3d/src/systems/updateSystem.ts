import renderSystem from "./utils/renderSystem"

export const [addUpdateSystem, deleteUpdateSystem] = renderSystem(
    (target: { update: () => void }) => target.update()
)
