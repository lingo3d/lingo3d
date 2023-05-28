import gameSystem from "./utils/gameSystem"

export const updateSystem = gameSystem({
    update: (target: { update: () => void }) => target.update()
})
