import store, { createEffect } from "@lincode/reactivity"
import GameGraph from "../visualScripting/GameGraph"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"

export const [setGameGraph, getGameGraph] = store<GameGraph | undefined>(
    undefined
)

createEffect(() => {
    const gameGraph = getGameGraph()
    if (!gameGraph) return
    addDisposeStateSystem(gameGraph, { setState: setGameGraph })
    return () => {
        deleteDisposeStateSystem(gameGraph)
    }
}, [getGameGraph])
