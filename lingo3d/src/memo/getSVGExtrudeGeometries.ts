import { SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import { Shape, Group, ExtrudeGeometry, Mesh } from "three"
import { measure } from "./measure"
import computeOnceWithData from "./utils/computeOnceWithData"

export default computeOnceWithData(
    (svgData: SVGResult, data: { src: string }) => {
        const shapes: Array<Shape> = []
        for (const path of svgData.paths)
            for (const shape of path.toShapes(true)) shapes.push(shape)

        if (!shapes.length) return []

        const testGroup = new Group()
        for (const shape of shapes) {
            const geom = new ExtrudeGeometry(shape, {
                depth: 0,
                bevelEnabled: false
            })
            geom.dispose()
            testGroup.add(new Mesh(geom))
        }

        const [{ y }] = measure(data.src, { target: testGroup })
        const result: Array<ExtrudeGeometry> = []
        for (const shape of shapes)
            result.push(
                new ExtrudeGeometry(shape, {
                    depth: y,
                    bevelEnabled: false
                })
            )
        return result
    }
)
