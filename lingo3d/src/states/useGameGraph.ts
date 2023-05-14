import store, { createEffect } from "@lincode/reactivity"
import GameGraph from "../visualScripting/GameGraph"
import {
    addClearStateSystem,
    deleteClearStateSystem
} from "../systems/eventSystems/clearStateSystem"

export const [setGameGraph, getGameGraph] = store<GameGraph | undefined>(
    undefined
)

createEffect(() => {
    const gameGraph = getGameGraph()
    if (!gameGraph) return
    addClearStateSystem(gameGraph, { setState: setGameGraph })
    return () => {
        deleteClearStateSystem(gameGraph)
    }
}, [getGameGraph])
