import { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getGrid } from "../../states/useGrid"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import { ssrExcludeSet } from "../renderLoop/effectComposer/ssrEffect/renderSetup"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"

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
