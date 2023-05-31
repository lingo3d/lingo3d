import createSystem from "./utils/createSystem"

export const updateSystem = createSystem("updateSystem", {
    update: (target: { update: () => void }) => target.update()
})
