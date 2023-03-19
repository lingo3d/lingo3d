import MenuButton from "../../component/MenuButton"
import createJoint from "./createJoint"
import sceneGraphMenuSignal from "./sceneGraphMenuSignal"

const CreateJointItems = () => {
    return (
        <>
            <MenuButton
                onClick={() => {
                    createJoint("fixedJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Fixed joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("sphericalJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Spherical joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("revoluteJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Revolute joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("prismaticJoint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                Prismatic joint
            </MenuButton>
            <MenuButton
                onClick={() => {
                    createJoint("d6Joint")
                    sceneGraphMenuSignal.value = undefined
                }}
            >
                D6 joint
            </MenuButton>
        </>
    )
}

export default CreateJointItems
