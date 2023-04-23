type MixinType<T> = Omit<T, "dispose" | "object3d">
export default MixinType
