import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { debounceTrailing, forceGet } from "@lincode/utils"
import mainCamera from "../engine/mainCamera"
import threeScene from "../engine/scene"
import {
    articulationJointDefaults,
    articulationJointSchema
} from "../interface/IArticulationJoint"
import { getCameraRendered } from "../states/useCameraRendered"
import { getPhysX } from "../states/usePhysX"
import MeshManager from "./core/MeshManager"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import destroy from "./core/PhysicsObjectManager/physx/destroy"
import {
    managerShapeLinkMap,
    actorPtrManagerMap
} from "./core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxTransform,
    assignPxTransformFromVector
} from "./core/PhysicsObjectManager/physx/updatePxVec"
import PositionedManager from "./core/PositionedManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./core/utils/HelperSphere"
import { quaternion, vector3 } from "./utils/reusables"

const childParentMap = new WeakMap<MeshManager, MeshManager>()
const parentChildrenMap = new WeakMap<MeshManager, Set<MeshManager>>()
const managerJointMap = new WeakMap<MeshManager, ArticulationJoint>()
const allManagers = new Set<MeshManager>()

const create = (rootManager: PhysicsObjectManager) => {
    const {
        physics,
        scene,
        PxRigidBodyExt,
        PxArticulationJointTypeEnum,
        PxArticulationAxisEnum,
        PxArticulationMotionEnum
    } = getPhysX()

    const ogParent = rootManager.outerObject3d.parent
    ogParent !== threeScene && threeScene.attach(rootManager.outerObject3d)

    const articulation = physics.createArticulationReducedCoordinate()

    const rootLink = articulation.createLink(
        null,
        assignPxTransform(rootManager)
    )
    const rootShape = rootManager.getPxShape(true, rootLink)
    PxRigidBodyExt.prototype.updateMassAndInertia(rootLink, rootManager.mass)
    managerShapeLinkMap.set(rootManager, [rootShape, rootLink])
    actorPtrManagerMap.set(rootLink.ptr, rootManager)

    const handle = new Cancellable()
    const traverse = (parentManager: PhysicsObjectManager, parentLink: any) => {
        for (const childManager of parentChildrenMap.get(parentManager) ?? []) {
            const articulationJoint = managerJointMap.get(childManager)
            if (
                !(childManager instanceof PhysicsObjectManager) ||
                !articulationJoint
            )
                continue

            const ogChildParent = childManager.outerObject3d.parent
            ogChildParent !== threeScene &&
                threeScene.attach(childManager.outerObject3d)

            const childLink = articulation.createLink(
                parentLink,
                assignPxTransform(childManager)
            )
            const childShape = childManager.getPxShape(true, childLink)
            PxRigidBodyExt.prototype.updateMassAndInertia(
                childLink,
                childManager.mass
            )
            managerShapeLinkMap.set(childManager, [childShape, childLink])
            actorPtrManagerMap.set(childLink.ptr, childManager)

            const joint = childLink.getInboundJoint()
            joint.setParentPose(
                assignPxTransformFromVector(
                    vector3
                        .copy(articulationJoint.outerObject3d.position)
                        .sub(parentManager.outerObject3d.position),
                    quaternion
                        .copy(parentManager.outerObject3d.quaternion)
                        .invert()
                )
            )
            joint.setChildPose(
                assignPxTransformFromVector(
                    vector3
                        .copy(articulationJoint.outerObject3d.position)
                        .sub(childManager.outerObject3d.position),
                    quaternion
                        .copy(childManager.outerObject3d.quaternion)
                        .invert()
                )
            )
            joint.setJointType(PxArticulationJointTypeEnum.eSPHERICAL())
            joint.setMotion(
                PxArticulationAxisEnum.eTWIST(),
                PxArticulationMotionEnum.eFREE()
            )
            joint.setMotion(
                PxArticulationAxisEnum.eSWING1(),
                PxArticulationMotionEnum.eFREE()
            )
            joint.setMotion(
                PxArticulationAxisEnum.eSWING2(),
                PxArticulationMotionEnum.eFREE()
            )
            handle.then(() => {
                destroy(joint)
                destroy(childLink)
                destroy(childShape)
                managerShapeLinkMap.delete(childManager)
                actorPtrManagerMap.delete(childLink.ptr)

                ogChildParent !== threeScene &&
                    ogChildParent?.attach(childManager.outerObject3d)
            })
            traverse(childManager, childLink)
        }
    }
    traverse(rootManager, rootLink)

    scene.addArticulation(articulation)

    handle.then(() => {
        destroy(rootLink)
        destroy(rootShape)
        managerShapeLinkMap.delete(rootManager)
        actorPtrManagerMap.delete(rootLink.ptr)

        scene.removeActor(articulation)
        destroy(articulation)

        ogParent !== threeScene && ogParent?.attach(rootManager.outerObject3d)
    })
    return handle
}

const createArticulations = debounceTrailing(() => {
    for (const manager of allManagers) {
        if (childParentMap.has(manager)) continue
        manager instanceof PhysicsObjectManager && create(manager)
    }
    allManagers.clear()
})

const makeSet = () => new Set<MeshManager>()

export default class ArticulationJoint extends PositionedManager {
    public static componentName = "articulationJoint"
    public static defaults = articulationJointDefaults
    public static schema = articulationJointSchema

    public constructor() {
        super()

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const sphere = new HelperSphere()
            sphere.scale = 0.1
            const handle = addSelectionHelper(sphere, this)
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])

        this.createEffect(() => {
            if (!getPhysX().physics) return

            const child = this.childState.get()
            const parent = this.parentState.get()
            if (!child || !parent) return

            const [[childManager]] = getMeshManagerSets(child)
            const [[parentManager]] = getMeshManagerSets(parent)
            if (!childManager || !parentManager) return

            managerJointMap.set(childManager, this)

            childParentMap.set(childManager, parentManager)
            forceGet(parentChildrenMap, parentManager, makeSet).add(
                childManager
            )
            allManagers.add(childManager)
            allManagers.add(parentManager)
            createArticulations()
        }, [this.childState.get, this.parentState.get, getPhysX])
    }

    private childState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get jointChild() {
        return this.childState.get()
    }
    public set jointChild(val) {
        this.childState.set(val)
    }

    private parentState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get jointParent() {
        return this.parentState.get()
    }
    public set jointParent(val) {
        this.parentState.set(val)
    }
}
