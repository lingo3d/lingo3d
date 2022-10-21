import MeshItem from "../core/MeshItem"

export default (target: MeshItem) =>
    target.nativeObject3d.scale.clone().multiply(target.outerObject3d.scale)
