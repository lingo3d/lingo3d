import store, { createEffect } from "@lincode/reactivity"
import GameGraph from "../display/GameGraph"
import { onDispose } from "../events/onDispose"

export const [setGameGraph, getGameGraph] = store<GameGraph | undefined>(
    undefined
)

createEffect(() => {
    const gameGraph = getGameGraph()
    if (!gameGraph) return

    const handle = onDispose(
        (item) => item === gameGraph && setGameGraph(undefined)
    )
    return () => {
        handle.cancel()
    }
}, [getGameGraph])
