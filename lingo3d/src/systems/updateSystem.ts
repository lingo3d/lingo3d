import createSystem from "./utils/createInternalSystem"

export const updateSystem = createSystem("updateSystem", {
    update: (target: { update: () => void }) => target.update()
})
