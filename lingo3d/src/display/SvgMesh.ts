import { applyMixins, forceGet } from "@lincode/utils"
import {
    ExtrudeGeometry,
    Group,
    Mesh,
    MeshStandardMaterial,
    Shape
} from "three"
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader"
import Loaded from "./core/Loaded"
import TexturedStandardMixin from "./core/mixins/TexturedStandardMixin"
import fit from "./utils/fit"
import measure from "./utils/measure"
import ISvgMesh, { svgMeshDefaults, svgMeshSchema } from "../interface/ISvgMesh"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../states/useLoadingCount"
import toResolvable from "./utils/toResolvable"
import { standardMaterial } from "./utils/reusables"

const svgGeometryCache = new WeakMap<SVGResult, Array<ExtrudeGeometry>>()

class SvgMesh extends Loaded<SVGResult> implements ISvgMesh {
    public static componentName = "svgMesh"
    public static defaults = svgMeshDefaults
    public static schema = svgMeshSchema

    private _innerHTML?: string
    public get innerHTML() {
        return this._innerHTML
    }
    public set innerHTML(val: string | undefined) {
        this._innerHTML = val
        this.loaded.done && this.loadedGroup.clear()

        this.cancelHandle(
            "src",
            val &&
                (() =>
                    toResolvable(
                        new Promise<SVGResult>((resolve) => {
                            increaseLoadingCount()
                            import("./utils/loaders/loadSVG").then(
                                ({ loader }) => {
                                    decreaseLoadingCount()
                                    resolve(loader.parse(val))
                                }
                            )
                        })
                    ).then((loaded) => {
                        const loadedObject3d = this.resolveLoaded(loaded, val)
                        this.loadedGroup.add(loadedObject3d)
                        this.loaded.resolve(loadedObject3d)

                        this.object3d.visible = !!this._boxVisible
                    }))
        )
    }

    protected async load(url: string) {
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

    protected resolveLoaded(svgData: SVGResult, src: string) {
        const loadedObject3d = new Group()
        loadedObject3d.scale.y *= -1

        const geometries = forceGet(svgGeometryCache, svgData, () => {
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

            const measuredSize = measure(testGroup, src)

            const result: Array<ExtrudeGeometry> = []
            for (const shape of shapes)
                result.push(
                    new ExtrudeGeometry(shape, {
                        depth: measuredSize.y,
                        bevelEnabled: false
                    })
                )
            return result
        })

        for (const geometry of geometries) {
            const mesh = new Mesh(geometry, this._material)
            mesh.castShadow = true
            mesh.receiveShadow = true
            loadedObject3d.add(mesh)
        }

        const measuredSize = fit(loadedObject3d, src)
        !this.widthSet && (this.object3d.scale.x = measuredSize.x)
        !this.heightSet && (this.object3d.scale.y = measuredSize.y)
        !this.depthSet && (this.object3d.scale.z = measuredSize.z)

        return loadedObject3d
    }

    private _material = standardMaterial
    public get material() {
        return this._material
    }
    public set material(val) {
        this._material = val
        const children = (this.loadedGroup.children[0]?.children ??
            []) as Array<Mesh<ExtrudeGeometry, MeshStandardMaterial>>
        for (const mesh of children) mesh.material = val
    }
}
interface SvgMesh extends Loaded<SVGResult>, TexturedStandardMixin {}
applyMixins(SvgMesh, [TexturedStandardMixin])
export default SvgMesh
