import Appendable from "../core/Appendable"

export default (manager: Appendable) => {
    const { schema, defaults, componentName, includeKeys } =
        manager.constructor as any
    return { schema, defaults, componentName, includeKeys }
}
