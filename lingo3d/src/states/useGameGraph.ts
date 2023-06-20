import store, { createEffect } from "@lincode/reactivity"
import GameGraph from "../visualScripting/GameGraph"
import { disposeStateSystem } from "../systems/eventSystems/disposeStateSystem"

export const [setGameGraph, getGameGraph] = store<GameGraph | undefined>(
    undefined
)

createEffect(() => {
    const gameGraph = getGameGraph()
    if (!gameGraph) return
    disposeStateSystem.add(gameGraph, { setState: setGameGraph })
    return () => {
        disposeStateSystem.delete(gameGraph)
    }
}, [getGameGraph])
