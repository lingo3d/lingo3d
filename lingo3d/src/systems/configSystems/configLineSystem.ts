import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import Line from "../../display/Line"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import scene from "../../engine/scene"
import { CM2M } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addConfigLineSystem, deleteConfigLineSystem] =
    configSystemWithCleanUp((self: Line) => {
        const { from, to, bloom, thickness } = self
        if (!from || !to) return

        const geometry = new LineGeometry().setPositions([
            from.x * CM2M,
            from.y * CM2M,
            from.z * CM2M,
            to.x * CM2M,
            to.y * CM2M,
            to.z * CM2M
        ])
        const material = new LineMaterial({
            linewidth: thickness * CM2M
        })
        const line = new Line2(geometry, material)
        scene.add(line)

        bloom && addSelectiveBloom(line)

        return () => {
            scene.remove(line)
            geometry.dispose()
            material.dispose()
            bloom && deleteSelectiveBloom(line)
        }
    })
