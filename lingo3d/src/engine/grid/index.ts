import { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getGrid } from "../../states/useGrid"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { editorBehaviorPtr } from "../../pointers/editorBehaviorPtr"

createEffect(() => {
    if (!getGrid() || !editorBehaviorPtr[0] || getWorldPlayComputed()) return

    const gridHelper = new InfiniteGridHelper()
    ssrExcludeSet.add(gridHelper)
    renderCheckExcludeSet.add(gridHelper)
    scene.add(gridHelper)

    return () => {
        scene.remove(gridHelper)
        ssrExcludeSet.delete(gridHelper)
        renderCheckExcludeSet.delete(gridHelper)
    }
}, [getGrid, getEditorBehavior, getWorldPlayComputed])
