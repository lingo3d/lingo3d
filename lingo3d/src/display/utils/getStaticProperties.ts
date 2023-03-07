import Appendable from "../../api/core/Appendable"

export const constructorMap = new WeakMap<any, any>()
export const getConstructor = (val: any) =>
    constructorMap.get(val) ?? val.constructor

export default (manager: Appendable) => {
    const { schema, defaults, componentName, includeKeys } =
        getConstructor(manager)
    return { schema, defaults, componentName, includeKeys }
}
