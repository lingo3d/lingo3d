import { applyMixins, forceGet, lazy } from "@lincode/utils"
import { ExtrudeBufferGeometry, Group, Mesh, MeshStandardMaterial, Shape } from "three"
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import Loaded from "./core/Loaded"
import TexturedBasicMixin from "./core/mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./core/mixins/TexturedStandardMixin"
import fit from "./utils/fit"
import measure from "./utils/measure"
import ISvgMesh from "../interface/ISvgMesh"

const lazyLoadSVG = lazy(() => import("./utils/loaders/loadSVG"))

const svgGeometryCache = new WeakMap<SVGResult, Array<ExtrudeBufferGeometry>>()

class SvgMesh extends Loaded<SVGResult> implements ISvgMesh {
    protected material = new MeshStandardMaterial()

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }

    protected load(url: string) {
        return lazyLoadSVG().then(loader => loader.default(url))
    }

    protected resolveLoaded(svgData: SVGResult) {
        const loadedObject3d = new Group()

        const geometries = forceGet(svgGeometryCache, svgData, () => {
            const shapes: Array<Shape> = []
            for (const path of svgData.paths)
                for (const shape of path.toShapes(true))
                    shapes.push(shape)

            if (!shapes.length) return []

            const testGroup = new Group()
            for (const shape of shapes)
                testGroup.add(new Mesh(new ExtrudeBufferGeometry(shape, {
                    depth: 0,
                    bevelEnabled: false
                })))

            const size = measure(testGroup)

            const result: Array<ExtrudeBufferGeometry> = []
            for (const shape of shapes)
                result.push(new ExtrudeBufferGeometry(shape, {
                    depth: size.y,
                    bevelEnabled: false
                }))
            return result
        })

        for (const geometry of geometries) {
            const mesh = new Mesh(geometry, this.material)
            // mesh.castShadow = true
            // mesh.receiveShadow = true
            loadedObject3d.add(mesh)
        }
        
        const size = fit(loadedObject3d, this._src!)
        !this.widthSet && (this.object3d.scale.x = size.x)
        !this.heightSet && (this.object3d.scale.y = size.y)
        !this.depthSet && (this.object3d.scale.z = size.z)

        loadedObject3d.scale.y *= -1

        this.loadedGroup.add(loadedObject3d)

        this.loadedResolvable.resolve(loadedObject3d)
    }
}
interface SvgMesh extends Loaded<SVGResult>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(SvgMesh, [TexturedBasicMixin, TexturedStandardMixin])
export default SvgMesh