import { applyMixins } from "@lincode/utils"
import { Group, Mesh } from "three"
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import Loaded from "./core/Loaded"
import TexturedStandardMixin, {
    StandardMesh
} from "./core/mixins/TexturedStandardMixin"
import { measureResize } from "../memo/measureResize"
import ISvgMesh, { svgMeshDefaults, svgMeshSchema } from "../interface/ISvgMesh"
import { standardMaterial } from "./utils/reusables"
import MixinType from "./core/mixins/utils/MixinType"
import { M2CM } from "../globals"
import getSVGExtrudeGeometries from "../memo/getSVGExtrudeGeometries"
import isOpaque from "../memo/isOpaque"

class SvgMesh extends Loaded<SVGResult> implements ISvgMesh {
    public static componentName = "svgMesh"
    public static defaults = svgMeshDefaults
    public static schema = svgMeshSchema

    public async $load(url: string) {
        const module = await import("./utils/loaders/loadSVG")
        let result: SVGResult
        try {
            result = await module.default(url)
        } catch {
            throw new Error(`Failed to load ${url}, check if src is correct`)
        }
        return result
    }

    public $resolveLoaded(svgData: SVGResult, src: string) {
        const loadedObject = new Group()
        loadedObject.scale.y *= -1

        const geometries = getSVGExtrudeGeometries(svgData, { src })
        for (const geometry of geometries) {
            const mesh = new Mesh(geometry, this._material)
            loadedObject.add(mesh)
            mesh.castShadow = isOpaque(mesh)
            mesh.receiveShadow = true
        }

        const [{ x, y, z }, center, scale] = measureResize(src, {
            target: loadedObject
        })
        loadedObject.scale.multiplyScalar(scale)
        loadedObject.position.copy(center).multiplyScalar(-1)
        this.runtimeDefaults = {
            width: x * M2CM,
            height: y * M2CM,
            depth: z * M2CM
        }
        !this.widthSet && (this.$innerObject.scale.x = x)
        !this.heightSet && (this.$innerObject.scale.y = y)
        !this.depthSet && (this.$innerObject.scale.z = z)

        return loadedObject
    }

    private _material = standardMaterial
    public get $material() {
        return this._material
    }
    public set $material(val) {
        this._material = val
        for (const mesh of this.$loadedObject?.children ?? [])
            (mesh as StandardMesh).material = val
    }
}
interface SvgMesh extends Loaded<SVGResult>, MixinType<TexturedStandardMixin> {}
applyMixins(SvgMesh, [TexturedStandardMixin])
export default SvgMesh
