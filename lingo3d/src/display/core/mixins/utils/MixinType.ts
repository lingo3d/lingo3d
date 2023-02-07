type MixinType<T> = Omit<T, "_dispose" | "dispose">
export default MixinType
