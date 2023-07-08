type MixinType<T> = Omit<T, "dispose" | "$innerObject" | "$object">
export default MixinType
