import store, { createEffect } from "@lincode/reactivity"
import { GameGraphData } from "../interface/IGameGraph"
import { getGameGraph } from "./useGameGraph"

const [setGameGraphData, getGameGraphData] = store<[GameGraphData | undefined]>(
    [undefined]
)
export { getGameGraphData }

createEffect(() => {
    const gameGraph = getGameGraph()
    if (!gameGraph) return

    const handle = gameGraph.gameGraphDataState.get(setGameGraphData)
    return () => {
        handle.cancel()
        setGameGraphData([undefined])
    }
}, [getGameGraph])
