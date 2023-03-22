import { createEffect } from "@lincode/reactivity"
import { getGridHelper } from "../../states/useGridHelper"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import { ssrExcludeSet } from "../renderLoop/effectComposer/ssrEffect/renderSetup"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"

createEffect(() => {
    if (!getGridHelper() || getWorldPlayComputed()) return

    const gridHelper = new InfiniteGridHelper()
    ssrExcludeSet.add(gridHelper)
    scene.add(gridHelper)

    return () => {
        scene.remove(gridHelper)
        ssrExcludeSet.delete(gridHelper)
    }
}, [getGridHelper, getWorldPlayComputed])
