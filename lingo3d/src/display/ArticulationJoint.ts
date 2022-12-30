import { Reactive } from "@lincode/reactivity"
import { debounceTrailing, forceGet } from "@lincode/utils"
import MeshManager from "./core/MeshManager"
import PositionedManager from "./core/PositionedManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"

const articulationMap = new WeakMap<MeshManager, MeshManager>()
const articulationManagers = new Set<MeshManager>()

const createSet = () => new Set<MeshManager>()

const createArticulations = debounceTrailing(() => {
    let connectedCount = 0
    const idManagerSetMap = new Map<number, Set<MeshManager>>()
    const managerIdMap = new WeakMap<MeshManager, number>()
    const baseToSetMap = new WeakMap<MeshManager, Set<MeshManager>>()

    for (const baseManager of articulationManagers) {
        const toManager = articulationMap.get(baseManager)
        if (!toManager) {
            //root found
            console.log("root found")
            continue
        }
        const id =
            managerIdMap.get(baseManager) ??
            managerIdMap.get(toManager) ??
            connectedCount++

        managerIdMap.set(baseManager, id)
        managerIdMap.set(toManager, id)

        const managerSet = forceGet(idManagerSetMap, id, createSet)
        managerSet.add(baseManager)
        managerSet.add(toManager)

        const toSet = forceGet(baseToSetMap, baseManager, createSet)
        toSet.add(toManager)
    }
    console.log(idManagerSetMap)
})

export default class ArticulationJoint extends PositionedManager {
    public constructor() {
        super()

        this.createEffect(() => {
            const base = this.baseState.get()
            const to = this.toState.get()
            if (!base || !to) return

            const [[baseManager]] = getMeshManagerSets(base)
            const [[toManager]] = getMeshManagerSets(to)
            if (!baseManager || !toManager) return

            articulationMap.set(baseManager, toManager)
            articulationManagers.add(baseManager)
            articulationManagers.add(toManager)
            createArticulations()
        }, [this.baseState.get, this.toState.get])
    }

    private baseState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get base() {
        return this.baseState.get()
    }
    public set base(val) {
        this.baseState.set(val)
    }

    private toState = new Reactive<string | MeshManager | undefined>(undefined)
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }
}
