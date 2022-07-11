import { Group, Mesh, Object3D } from "three"
import { boxGeometry } from "../primitives/Cube"
import { wireframeMaterial } from "../utils/reusables"
import ObjectManager from "./ObjectManager"
import ILoaded from "../../interface/ILoaded"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlinePass"
import {
    addBloom,
    deleteBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import Reresolvable from "./utils/Reresolvable"
import { Cancellable } from "@lincode/promiselikes"
import toResolvable from "../utils/toResolvable"

export default abstract class Loaded<T = Object3D>
    extends ObjectManager<Mesh>
    implements ILoaded
{
    public loadedGroup = new Group()

    public constructor() {
        super(new Mesh(boxGeometry, wireframeMaterial))
        this.outerObject3d.add(this.loadedGroup)
    }

    public loaded = new Reresolvable<Object3D>()

    protected abstract load(src: string): Promise<T>

    protected abstract resolveLoaded(data: T): Group

    protected _src?: string
    public get src() {
        return this._src
    }
    public set src(val) {
        this._src = val
        this.loaded.done && this.loadedGroup.clear()

        this.cancelHandle(
            "src",
            val &&
                (() =>
                    toResolvable(this.load(val)).then((loaded) => {
                        const loadedObject3d = this.resolveLoaded(loaded)
                        this.loadedGroup.add(loadedObject3d)
                        this.loaded.resolve(loadedObject3d)

                        this.object3d.visible = !!this._boxVisible
                    }))
        )
    }

    private _onLoad?: () => void
    public get onLoad() {
        return this._onLoad
    }
    public set onLoad(cb) {
        this._onLoad = cb
        this.cancelHandle("onLoad", cb && (() => this.loaded.then(cb)))
    }

    protected widthSet?: boolean
    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        this.widthSet = true
    }

    protected heightSet?: boolean
    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        this.heightSet = true
    }

    protected depthSet?: boolean
    public override get depth() {
        return super.depth
    }
    public override set depth(val) {
        super.depth = val
        this.depthSet = true
    }

    public override get innerRotationX() {
        return super.innerRotationX
    }
    public override set innerRotationX(val) {
        super.innerRotationX = val
        this.loadedGroup.rotation.x = this.object3d.rotation.x
    }

    public override get innerRotationY() {
        return super.innerRotationY
    }
    public override set innerRotationY(val) {
        super.innerRotationY = val
        this.loadedGroup.rotation.y = this.object3d.rotation.y
    }

    public override get innerRotationZ() {
        return super.innerRotationZ
    }
    public override set innerRotationZ(val) {
        super.innerRotationZ = val
        this.loadedGroup.rotation.z = this.object3d.rotation.z
    }

    public override get innerX() {
        return super.innerX
    }
    public override set innerX(val) {
        super.innerX = val
        this.loadedGroup.position.x = this.object3d.position.x
    }

    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val) {
        super.innerY = val
        this.loadedGroup.position.y = this.object3d.position.y
    }

    public override get innerZ() {
        return super.innerZ
    }
    public override set innerZ(val) {
        super.innerZ = val
        this.loadedGroup.position.z = this.object3d.position.z
    }

    public override get innerVisible() {
        return this.loadedGroup.visible
    }
    public override set innerVisible(val) {
        this.loadedGroup.visible = val
    }

    public override get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public override set frustumCulled(val) {
        if (this.outerObject3d.frustumCulled === val) return
        this.outerObject3d.frustumCulled = val

        this.cancelHandle("frustumCulled", () =>
            this.loaded.then(() => {
                super.frustumCulled = val
            })
        )
    }

    public override get physics() {
        return this._physics ?? false
    }
    public override set physics(val) {
        if (this._physics === val) return
        this._physics = val

        const handle = this.cancelHandle("physics", () =>
            this.loaded.then(() => {
                this.initPhysics(val, handle!)
            })
        )
    }

    private _boxVisible?: boolean
    public get boxVisible() {
        return this._boxVisible ?? this.object3d.visible
    }
    public set boxVisible(val) {
        this._boxVisible = val
        this.object3d.visible = val
    }

    private _outline?: boolean
    public override get outline() {
        return !!this._outline
    }
    public override set outline(val) {
        if (this._outline === val) return
        this._outline = val

        this.cancelHandle("outline", () =>
            this.loaded.then((loaded) => {
                if (!val) return

                addOutline(loaded)
                return () => {
                    deleteOutline(loaded)
                }
            })
        )
    }

    private _bloom?: boolean
    public override get bloom() {
        return !!this._bloom
    }
    public override set bloom(val) {
        if (this._bloom === val) return
        this._bloom = val

        this.cancelHandle("bloom", () =>
            this.loaded.then((loaded) => {
                if (!val) return

                addBloom(loaded)
                return () => {
                    deleteBloom(loaded)
                }
            })
        )
    }

    private managerSet?: boolean
    protected override addToRaycastSet(set: Set<Object3D>) {
        const handle = new Cancellable()

        queueMicrotask(() => {
            if (handle.done) return

            if (this._physics === "map" || this._physics === "map-debug")
                handle.watch(
                    this.loaded.then((loaded) => {
                        if (!this.managerSet) {
                            this.managerSet = true
                            loaded.traverse(
                                (child) => (child.userData.manager ??= this)
                            )
                        }
                        set.add(loaded)
                        return () => {
                            set.delete(loaded)
                        }
                    })
                )
            else handle.watch(super.addToRaycastSet(set))
        })
        return handle
    }

    protected override refreshFactors() {
        this.cancelHandle("refreshFactors", () =>
            this.loaded.then(() => super.refreshFactors())
        )
    }
}
