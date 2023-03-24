import { sceneGraphContextMenuSignal } from "."
import MenuButton from "../../component/MenuButton"
import createJoint from "./createJoint"

const CreateJointItems = () => {
    return (
        <>
            <MenuButton
                onClick={() => {
                    createJoint("fixedJoint")
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Fixed joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("sphericalJoint")
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Spherical joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("revoluteJoint")
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Revolute joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("prismaticJoint")
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                Prismatic joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("d6Joint")
                    sceneGraphContextMenuSignal.value = undefined
                }}
            >
                D6 joint
            </MenuButton>
        </>
    )
}

export default CreateJointItems
