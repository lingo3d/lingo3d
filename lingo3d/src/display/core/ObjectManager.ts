import { Object3D, PropertyBinding } from "three"
import { deg2Rad, rad2Deg } from "@lincode/math"
import scene from "../../engine/scene"
import { scaleDown, scaleUp } from "../../engine/constants"
import IObjectManager from "../../interface/IObjectManager"
import FoundManager from "./FoundManager"
import PhysicsObjectManager from "./PhysicsObjectManager"

export default abstract class ObjectManager<T extends Object3D = Object3D>
    extends PhysicsObjectManager<T>
    implements IObjectManager
{
    public constructor(object3d = new Object3D() as T) {
        super(object3d)

        const outerObject3d = (this.outerObject3d = new Object3D() as T)
        outerObject3d.userData.manager = this

        scene.add(outerObject3d)
        outerObject3d.add(object3d)
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
        return this.object3d.position.x * scaleUp
    }
    public set innerX(val) {
        this.object3d.position.x = val * scaleDown
    }

    public get innerY() {
        return this.object3d.position.y * scaleUp
    }
    public set innerY(val) {
        this.object3d.position.y = val * scaleDown
    }

    public get innerZ() {
        return this.object3d.position.z * scaleUp
    }
    public set innerZ(val) {
        this.object3d.position.z = val * scaleDown
    }

    public find(
        name: string,
        hiddenFromSceneGraph?: boolean
    ): FoundManager | undefined {
        const child = this.outerObject3d.getObjectByName(
            PropertyBinding.sanitizeNodeName(name)
        )
        if (!child) return

        const result = (child.userData.manager ??= new FoundManager(child))
        !hiddenFromSceneGraph && this._append(result)

        return result
    }

    public findAll(name?: string | RegExp): Array<FoundManager> {
        const result: Array<FoundManager> = []
        if (name === undefined)
            this.outerObject3d.traverse((child) => {
                result.push(
                    (child.userData.manager ??= new FoundManager(child))
                )
            })
        else if (typeof name === "string")
            this.outerObject3d.traverse((child) => {
                child.name === name &&
                    result.push(
                        (child.userData.manager ??= new FoundManager(child))
                    )
            })
        else
            this.outerObject3d.traverse((child) => {
                name.test(child.name) &&
                    result.push(
                        (child.userData.manager ??= new FoundManager(child))
                    )
            })
        return result
    }
}
