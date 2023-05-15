import { Reactive } from "@lincode/reactivity"
import { merge } from "@lincode/utils"
import Appendable from "../display/core/Appendable"
import IGameGraph, {
    GameGraphData,
    gameGraphDefaults,
    gameGraphSchema
} from "../interface/IGameGraph"

export default class GameGraph extends Appendable implements IGameGraph {
    public static componentName = "gameGraph"
    public static defaults = gameGraphDefaults
    public static schema = gameGraphSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const paused = this.pausedState.get()
            if (paused) return
        }, [this.pausedState.get])
    }

    public gameGraphDataState = new Reactive<[GameGraphData]>([{}])

    public get data() {
        return this.gameGraphDataState.get()[0]
    }
    public set data(val: GameGraphData) {
        this.gameGraphDataState.set([val])
    }

    public mergeData(data: GameGraphData) {
        const [prevData] = this.gameGraphDataState.get()
        if (!prevData) {
            this.gameGraphDataState.set([data])
            return
        }
        merge(prevData, data)
        this.gameGraphDataState.set([prevData])
    }

    public deleteData(uuid: string) {
        const [prevData] = this.gameGraphDataState.get()
        if (!prevData) return
        delete prevData[uuid]
        this.gameGraphDataState.set([prevData])
    }

    private pausedState = new Reactive(false)
    public get paused() {
        return this.pausedState.get()
    }
    public set paused(val) {
        this.pausedState.set(val)
    }
}
