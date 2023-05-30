import createSystem from "./utils/createSystem"

export const updateSystem = createSystem({
    update: (target: { update: () => void }) => target.update()
})
