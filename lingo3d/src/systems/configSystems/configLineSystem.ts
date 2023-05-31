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
import createSystem from "../utils/createSystem"

export const configLineSystem = createSystem("configLineSystem", {
    data: {} as { line: Line2; geometry: LineGeometry; material: LineMaterial },
    setup: (self: Line, data) => {
        const { from, to, bloom, thickness } = self
        if (!from || !to) return false

        const geometry = (data.geometry = new LineGeometry().setPositions([
            from.x * CM2M,
            from.y * CM2M,
            from.z * CM2M,
            to.x * CM2M,
            to.y * CM2M,
            to.z * CM2M
        ]))
        const material = (data.material = new LineMaterial({
            linewidth: thickness * CM2M
        }))
        const line = (data.line = new Line2(geometry, material))
        scene.add(line)

        bloom && addSelectiveBloom(line)
    },
    cleanup: (self, data) => {
        scene.remove(data.line)
        data.geometry.dispose()
        data.material.dispose()
        self.bloom && deleteSelectiveBloom(data.line)
    }
})
