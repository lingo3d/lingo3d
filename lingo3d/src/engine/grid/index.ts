import { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getGrid } from "../../states/useGrid"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"

createEffect(() => {
    if (!getGrid() || !getEditorBehavior() || getWorldPlayComputed()) return

    const gridHelper = new InfiniteGridHelper()
    ssrExcludeSet.add(gridHelper)
    scene.add(gridHelper)

    return () => {
        scene.remove(gridHelper)
        ssrExcludeSet.delete(gridHelper)
    }
}, [getGrid, getEditorBehavior, getWorldPlayComputed])
