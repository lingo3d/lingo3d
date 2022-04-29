import PhysicsItem from "../core/SimpleObjectManager/PhysicsItem"

export default (target: PhysicsItem) => target.object3d.scale.clone().multiply(target.outerObject3d.scale)