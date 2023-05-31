import createInternalSystem from "./utils/createInternalSystem"

export const updateSystem = createInternalSystem("updateSystem", {
    update: (target: { update: () => void }) => target.update()
})
