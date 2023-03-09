import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import createJoint from "../utils/createJoint"
import sceneGraphMenuSignal from "./sceneGraphMenuSignal"

const CreateJointItems = () => {
    return (
        <>
            <ContextMenuItem
                onClick={() => {
                    createJoint("fixedJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Fixed joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("sphericalJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Spherical joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("revoluteJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Revolute joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("prismaticJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Prismatic joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("d6Joint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                D6 joint
            </ContextMenuItem>
        </>
    )
}

export default CreateJointItems
