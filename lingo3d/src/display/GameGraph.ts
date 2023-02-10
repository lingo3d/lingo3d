import { Reactive } from "@lincode/reactivity"
import { merge } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import {
    GameGraphData,
    gameGraphDefaults,
    gameGraphSchema
} from "../interface/IGameGraph"

export default class GameGraph extends Appendable {
    public static componentName = "gameGraph"
    public static defaults = gameGraphDefaults
    public static schema = gameGraphSchema

    public constructor() {
        super()
    }

    public gameGraphDataState = new Reactive<[GameGraphData | undefined]>([
        undefined
    ])

    public get data() {
        return this.gameGraphDataState.get()[0]
    }
    public set data(val: GameGraphData | undefined) {
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
}
