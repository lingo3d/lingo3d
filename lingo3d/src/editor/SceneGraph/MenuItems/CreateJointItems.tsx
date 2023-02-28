import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import createJoint from "../utils/createJoint"

type Props = {
    setPosition: (val: undefined) => void
}

const CreateJointItems = ({ setPosition }: Props) => {
    return (
        <>
            <ContextMenuItem
                onClick={() => {
                    createJoint("fixedJoint")
                    setPosition(undefined)
                }}
            >
                Fixed joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("sphericalJoint")
                    setPosition(undefined)
                }}
            >
                Spherical joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("revoluteJoint")
                    setPosition(undefined)
                }}
            >
                Revolute joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("prismaticJoint")
                    setPosition(undefined)
                }}
            >
                Prismatic joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("d6Joint")
                    setPosition(undefined)
                }}
            >
                D6 joint
            </ContextMenuItem>
        </>
    )
}

export default CreateJointItems
