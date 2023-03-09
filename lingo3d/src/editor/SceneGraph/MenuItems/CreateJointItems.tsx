import { Signal } from "@preact/signals"
import ContextMenuItem from "../../component/ContextMenu/ContextMenuItem"
import createJoint from "../utils/createJoint"
import { Position } from "./Position"

type Props = {
    positionSignal: Signal<Position | undefined>
}

const CreateJointItems = ({ positionSignal }: Props) => {
    return (
        <>
            <ContextMenuItem
                onClick={() => {
                    createJoint("fixedJoint")
                    positionSignal.value = undefined
                }}
            >
                Fixed joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("sphericalJoint")
                    positionSignal.value = undefined
                }}
            >
                Spherical joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("revoluteJoint")
                    positionSignal.value = undefined
                }}
            >
                Revolute joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("prismaticJoint")
                    positionSignal.value = undefined
                }}
            >
                Prismatic joint
            </ContextMenuItem>
            <ContextMenuItem
                onClick={() => {
                    createJoint("d6Joint")
                    positionSignal.value = undefined
                }}
            >
                D6 joint
            </ContextMenuItem>
        </>
    )
}

export default CreateJointItems
