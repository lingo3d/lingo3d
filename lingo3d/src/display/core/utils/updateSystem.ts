import beforeRenderSystem from "../../../utils/beforeRenderSystem"

export const [addUpdateSystem, deleteUpdateSystem] = beforeRenderSystem(
    (helper: { update: () => void }) => {
        helper.update()
    }
)
