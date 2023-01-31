import { Object3D, PropertyBinding } from "three"
import { deg2Rad, rad2Deg } from "@lincode/math"
import scene from "../../engine/scene"
import IObjectManager from "../../interface/IObjectManager"
import FoundManager from "./FoundManager"
import PhysicsObjectManager from "./PhysicsObjectManager"
import { setManager } from "../../api/utils/getManager"
import { CM2M, M2CM } from "../../globals"
import { getFoundManager } from "../../api/utils/getFoundManager"

export default abstract class ObjectManager<T extends Object3D = Object3D>
    extends PhysicsObjectManager<T>
    implements IObjectManager
{
    public constructor(object3d = new Object3D() as T, unmounted?: boolean) {
        super(new Object3D() as T)
        this.object3d = object3d
        setManager(object3d, this)
        !unmounted && scene.add(this.outerObject3d)
        this.outerObject3d.add(object3d)
    }

    public get innerRotationX() {
        return this.object3d.rotation.x * rad2Deg
    }
    public set innerRotationX(val) {
        this.object3d.rotation.x = val * deg2Rad
    }

    public get innerRotationY() {
        return this.object3d.rotation.y * rad2Deg
    }
    public set innerRotationY(val) {
        this.object3d.rotation.y = val * deg2Rad
    }

    public get innerRotationZ() {
        return this.object3d.rotation.z * rad2Deg
    }
    public set innerRotationZ(val) {
        this.object3d.rotation.z = val * deg2Rad
    }

    public get innerRotation() {
        return this.innerRotationZ
    }
    public set innerRotation(val) {
        this.innerRotationZ = val
    }

    public get innerX() {
        return this.object3d.position.x * M2CM
    }
    public set innerX(val) {
        this.object3d.position.x = val * CM2M
    }

    public get innerY() {
        return this.object3d.position.y * M2CM
    }
    public set innerY(val) {
        this.object3d.position.y = val * CM2M
    }

    public get innerZ() {
        return this.object3d.position.z * M2CM
    }
    public set innerZ(val) {
        this.object3d.position.z = val * CM2M
    }

    public get width() {
        return this.object3d.scale.x * M2CM
    }
    public set width(val) {
        this.object3d.scale.x = val * CM2M
    }

    public get height() {
        return this.object3d.scale.y * M2CM
    }
    public set height(val) {
        this.object3d.scale.y = val * CM2M
    }

    public get depth() {
        return this.object3d.scale.z * M2CM
    }
    public set depth(val) {
        this.object3d.scale.z = val * CM2M
    }

    public find(
        name: string,
        hiddenFromSceneGraph?: boolean
    ): FoundManager | undefined {
        const child = this.outerObject3d.getObjectByName(
            PropertyBinding.sanitizeNodeName(name)
        )
        if (!child) return
        return getFoundManager(child, this, hiddenFromSceneGraph)
    }

    public findAll(
        name?: string | RegExp | ((name: string) => boolean)
    ): Array<FoundManager> {
        const result: Array<FoundManager> = []
        if (name === undefined)
            this.outerObject3d.traverse((child) => {
                result.push(getFoundManager(child, this))
            })
        else if (typeof name === "string")
            this.outerObject3d.traverse((child) => {
                child.name === name && result.push(getFoundManager(child, this))
            })
        else if (typeof name === "function")
            this.outerObject3d.traverse((child) => {
                name(child.name) && result.push(getFoundManager(child, this))
            })
        else
            this.outerObject3d.traverse((child) => {
                name.test(child.name) &&
                    result.push(getFoundManager(child, this))
            })
        return result
    }
}
