import { createEffect } from "@lincode/reactivity"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getGrid } from "../../states/useGrid"
import scene from "../scene"
import InfiniteGridHelper from "./InfiniteGridHelper"
import { excludeSSRSet } from "../../collections/excludeSSRSet"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { editorBehaviorPtr } from "../../pointers/editorBehaviorPtr"
import { getWorldPlay } from "../../states/useWorldPlay"
import { worldPlayPtr } from "../../pointers/worldPlayPtr"
import { deg2Rad } from "@lincode/math"
import { Mesh, PlaneGeometry } from "three"
import { standardMaterial } from "../../display/utils/reusables"
import { editorPlanePtr } from "../../pointers/editorPlanePtr"

createEffect(() => {
    if (!getGrid() || !editorBehaviorPtr[0] || worldPlayPtr[0] !== "editor")
        return

    const gridHelper = new InfiniteGridHelper()
    excludeSSRSet.add(gridHelper)
    renderCheckExcludeSet.add(gridHelper)
    scene.add(gridHelper)

    const editorPlane = (editorPlanePtr[0] = new Mesh(
        new PlaneGeometry(1000, 1000),
        standardMaterial
    ))
    editorPlane.rotateX(90 * deg2Rad)
    editorPlane.visible = false
    scene.add(editorPlane)

    return () => {
        scene.remove(gridHelper)
        excludeSSRSet.delete(gridHelper)
        renderCheckExcludeSet.delete(gridHelper)

        editorPlane.geometry.dispose()
        scene.remove(editorPlane)
        editorPlanePtr[0] = undefined
    }
}, [getGrid, getEditorBehavior, getWorldPlay])
