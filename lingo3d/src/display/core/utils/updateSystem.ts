import renderSystem from "../../../utils/renderSystem"

export const [addUpdateSystem, deleteUpdateSystem] = renderSystem(
    (helper: { update: () => void }) => {
        helper.update()
    }
)
