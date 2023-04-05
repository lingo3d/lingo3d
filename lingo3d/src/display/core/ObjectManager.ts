import { Object3D, PropertyBinding } from "three"
import { deg2Rad, rad2Deg } from "@lincode/math"
import IObjectManager from "../../interface/IObjectManager"
import FoundManager from "./FoundManager"
import { getManager, setManager } from "../../api/utils/getManager"
import { CM2M, M2CM } from "../../globals"
import MeshAppendable from "../../api/core/MeshAppendable"
import SimpleObjectManager from "./SimpleObjectManager"
import { addUpdatePhysicsSystem } from "../../systems/configSystems/updatePhysicsSystem"
import { pxUpdateShapeSet } from "../../collections/pxUpdateShapeSet"

export const getFoundManager = (
    child: Object3D,
    parentManager: MeshAppendable
) => {
    const childManager = getManager(child)
    if (childManager) {
        if (childManager instanceof FoundManager) return childManager
        return undefined
    }
    const result = setManager(child, new FoundManager(child, parentManager))
    return result
}

export default abstract class ObjectManager<T extends Object3D = Object3D>
    extends SimpleObjectManager<T>
    implements IObjectManager
{
    public constructor(object3d = new Object3D() as T, unmounted?: boolean) {
        super(new Object3D() as T, unmounted)
        this.object3d = object3d
        setManager(object3d, this)
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
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
    }

    public get height() {
        return this.object3d.scale.y * M2CM
    }
    public set height(val) {
        this.object3d.scale.y = val * CM2M
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
    }

    public get depth() {
        return this.object3d.scale.z * M2CM
    }
    public set depth(val) {
        this.object3d.scale.z = val * CM2M
        pxUpdateShapeSet.add(this)
        addUpdatePhysicsSystem(this)
    }

    public find(name: string): FoundManager | undefined {
        const child = this.outerObject3d.getObjectByName(
            PropertyBinding.sanitizeNodeName(name)
        )
        if (!child) return
        return getFoundManager(child, this)
    }

    public findAll(
        name?: string | RegExp | ((name: string) => boolean)
    ): Array<FoundManager> {
        const result: Array<FoundManager> = []
        if (name === undefined)
            this.outerObject3d.traverse((child) => {
                const found = getFoundManager(child, this)
                found && result.push(found)
            })
        else if (typeof name === "string") {
            const sanitized = PropertyBinding.sanitizeNodeName(name)
            this.outerObject3d.traverse((child) => {
                if (child.name !== sanitized) return
                const found = getFoundManager(child, this)
                found && result.push(found)
            })
        } else if (typeof name === "function")
            this.outerObject3d.traverse((child) => {
                if (!name(child.name)) return
                const found = getFoundManager(child, this)
                found && result.push(found)
            })
        else
            this.outerObject3d.traverse((child) => {
                if (!name.test(child.name)) return
                const found = getFoundManager(child, this)
                found && result.push(found)
            })
        return result
    }
}
