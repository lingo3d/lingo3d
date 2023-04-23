type MixinType<T> = Omit<T, "dispose" | "object3d" | "outerObject3d">
export default MixinType
