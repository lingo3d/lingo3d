import { Object3D, Group, PropertyBinding } from "three"
import { deg2Rad, rad2Deg } from "@lincode/math"
import scene from "../../engine/scene"
import SimpleObjectManager from "./SimpleObjectManager"
import { scaleDown, scaleUp } from "../../engine/constants"
import IObjectManager from "../../interface/IObjectManager"
import FoundManager from "./FoundManager"

export default abstract class ObjectManager<T extends Object3D = Object3D> extends SimpleObjectManager<T> implements IObjectManager {
    public constructor(object3d: T) {
        super(object3d)
        
        const group = this.outerObject3d = new Group()
        group.userData.manager = this

        scene.add(group)
        group.add(object3d)
    }

    public get innerRotationX() {
        return this.object3d.rotation.x * rad2Deg
    }
    public set innerRotationX(val: number) {
        this.object3d.rotation.x = val * deg2Rad
    }

    public get innerRotationY() {
        return this.object3d.rotation.y * rad2Deg
    }
    public set innerRotationY(val: number) {
        this.object3d.rotation.y = val * deg2Rad
    }

    public get innerRotationZ() {
        return this.object3d.rotation.z * rad2Deg
    }
    public set innerRotationZ(val: number) {
        this.object3d.rotation.z = val * deg2Rad
    }

    public get innerRotation() {
        return this.innerRotationZ
    }
    public set innerRotation(val: number) {
        this.innerRotationZ = val
    }

    public get innerX() {
        return this.object3d.position.x * scaleUp
    }
    public set innerX(val: number) {
        this.object3d.position.x = val * scaleDown
    }

    public get innerY() {
        return this.object3d.position.y * scaleUp
    }
    public set innerY(val: number) {
        this.object3d.position.y = val * scaleDown
    }

    public get innerZ() {
        return this.object3d.position.z * scaleUp
    }
    public set innerZ(val: number) {
        this.object3d.position.z = val * scaleDown
    }

    public find(name: string): FoundManager | undefined {
        const child = this.outerObject3d.getObjectByName(PropertyBinding.sanitizeNodeName(name))
        return child && (child.userData.manager ??= new FoundManager(child))
    }

    public findAll(name: string): Array<FoundManager> {
        const result: Array<FoundManager> = []

        this.outerObject3d.traverse(child => {
            child.name === name && result.push(child.userData.manager ??= new FoundManager(child))
        })
        return result
    }
}