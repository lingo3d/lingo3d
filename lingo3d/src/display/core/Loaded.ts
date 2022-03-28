import { Cancellable, Resolvable } from "@lincode/promiselikes"
import { Group, Mesh, Object3D } from "three"
import { boxGeometry } from "../primitives/Cube"
import { wireframeMaterial } from "../utils/reusables"
import ObjectManager from "./ObjectManager"
import ILoaded from "../../interface/ILoaded"
import { PhysicsOptions } from "../../interface/IPhysics"

export default abstract class Loaded<T> extends ObjectManager<Mesh> implements ILoaded {
    protected loadedGroup = new Group()
    
    public constructor() {
        super(new Mesh(boxGeometry, wireframeMaterial))
        this.outerObject3d.add(this.loadedGroup)
    }

    protected loadedResolvable = new Resolvable<Object3D>()

    protected abstract load(src: string): Promise<T>

    protected abstract resolveLoaded(data: T): void

    protected _src?: string
    public get src() {
        return this._src
    }
    public set src(src: string | undefined) {
        if (this._src === src) return
        this._src = src

        if (!src) return

        if (this.loadedResolvable.done) {
            this.loadedResolvable = new Resolvable()
            this.loadedGroup.clear()
        }

        this.load(src).then(loaded => {
            if (this.done || this._src !== src) return

            this.object3d.visible = !!this._boxVisible
            this.resolveLoaded(loaded)
        })
    }

    private loadedHandle?: Cancellable
    private _onLoad?: () => void
    public get onLoad() {
        return this._onLoad
    }
    public set onLoad(cb: (() => void) | undefined) {
        this._onLoad = cb
        this.loadedHandle?.cancel()
        cb && (this.loadedHandle = this.loadedResolvable.then(cb))
    }

    protected widthSet?: boolean
    public override get width() {
        return super.width
    }
    public override set width(val: number) {
        super.width = val
        this.widthSet = true
    }

    protected heightSet?: boolean
    public override get height() {
        return super.height
    }
    public override set height(val: number) {
        super.height = val
        this.heightSet = true
    }

    protected depthSet?: boolean
    public override get depth() {
        return super.depth
    }
    public override set depth(val: number) {
        super.depth = val
        this.depthSet = true
    }

    public override get innerRotationX() {
        return super.innerRotationX
    }
    public override set innerRotationX(val: number) {
        super.innerRotationX = val
        this.loadedGroup.rotation.x = this.object3d.rotation.x
    }

    public override get innerRotationY() {
        return super.innerRotationY
    }
    public override set innerRotationY(val: number) {
        super.innerRotationY = val
        this.loadedGroup.rotation.y = this.object3d.rotation.y
    }

    public override get innerRotationZ() {
        return super.innerRotationZ
    }
    public override set innerRotationZ(val: number) {
        super.innerRotationZ = val
        this.loadedGroup.rotation.z = this.object3d.rotation.z
    }

    public override get innerX() {
        return super.innerX
    }
    public override set innerX(val: number) {
        super.innerX = val
        this.loadedGroup.position.x = this.object3d.position.x
    }

    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val: number) {
        super.innerY = val
        this.loadedGroup.position.y = this.object3d.position.y
    }

    public override get innerZ() {
        return super.innerZ
    }
    public override set innerZ(val: number) {
        super.innerZ = val
        this.loadedGroup.position.z = this.object3d.position.z
    }

    public override get innerVisible() {
        return this.loadedGroup.visible
    }
    public override set innerVisible(val: boolean) {
        this.loadedGroup.visible = val
    }

    public override get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public override set frustumCulled(val: boolean) {
        if (this.outerObject3d.frustumCulled === val) return
        this.outerObject3d.frustumCulled = val
        
        this.loadedResolvable.then(() => super.frustumCulled = val)
    }

    public override get physics() {
        return this._physics ?? false
    }
    public override set physics(val: PhysicsOptions) {
        if (this._physics === val) return
        this._physics = val

        this.physicsHandle?.cancel()
        const handle = this.physicsHandle = this.cancellable()
        
        this.loadedResolvable.then(() => this.initPhysics(val, handle))
    }

    private _boxVisible?: boolean
    public get boxVisible() {
        return this._boxVisible ?? this.object3d.visible
    }
    public set boxVisible(val: boolean) {
        this._boxVisible = val
        this.object3d.visible = val
    }
}