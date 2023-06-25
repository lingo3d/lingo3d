import { applyMixins } from "@lincode/utils"
import { Group, Mesh } from "three"
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import Loaded from "./core/Loaded"
import TexturedStandardMixin, {
    StandardMesh
} from "./core/mixins/TexturedStandardMixin"
import fit from "./utils/fit"
import ISvgMesh, { svgMeshDefaults, svgMeshSchema } from "../interface/ISvgMesh"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../states/useLoadingCount"
import { standardMaterial } from "./utils/reusables"
import MixinType from "./core/mixins/utils/MixinType"
import { M2CM } from "../globals"
import isOpaque from "../memo/isOpaque"
import getSVGExtrudeGeometries from "../memo/getSVGExtrudeGeometries"

class SvgMesh extends Loaded<SVGResult> implements ISvgMesh {
    public static componentName = "svgMesh"
    public static defaults = svgMeshDefaults
    public static schema = svgMeshSchema

    public async $load(url: string) {
        increaseLoadingCount()
        const module = await import("./utils/loaders/loadSVG")
        let result: SVGResult
        try {
            result = await module.default(url)
        } catch {
            decreaseLoadingCount()
            throw new Error("Failed to load svg, check if src is correct")
        }
        decreaseLoadingCount()
        return result
    }

    public $resolveLoaded(svgData: SVGResult, src: string) {
        const loadedObject3d = new Group()
        loadedObject3d.scale.y *= -1

        const geometries = getSVGExtrudeGeometries(svgData, { src })
        for (const geometry of geometries) {
            const mesh = new Mesh(geometry, this._material)
            loadedObject3d.add(mesh)
            mesh.receiveShadow = true
            if (isOpaque(mesh)) mesh.castShadow = true
        }

        const [{ x, y, z }] = fit(loadedObject3d, src)
        this.runtimeDefaults = {
            width: x * M2CM,
            height: y * M2CM,
            depth: z * M2CM
        }
        !this.widthSet && (this.object3d.scale.x = x)
        !this.heightSet && (this.object3d.scale.y = y)
        !this.depthSet && (this.object3d.scale.z = z)

        return loadedObject3d
    }

    private _material = standardMaterial
    public get $material() {
        return this._material
    }
    public set $material(val) {
        this._material = val
        const children = (this.$loadedObject3d?.children ??
            []) as Array<StandardMesh>
        for (const mesh of children) mesh.material = val
    }
}
interface SvgMesh extends Loaded<SVGResult>, MixinType<TexturedStandardMixin> {}
applyMixins(SvgMesh, [TexturedStandardMixin])
export default SvgMesh
