type ExtractProps<Type> = {
    [Property in keyof Type]: Type[Property] extends string ? StringConstructor : Type[Property] extends number ? NumberConstructor : Type[Property] extends boolean ? BooleanConstructor : Type[Property] extends Function ? FunctionConstructor : Type[Property] extends Array<any> ? ArrayConstructor : Type[Property] extends Object ? ObjectConstructor : NumberConstructor
}
  
export const extractProps = <T>(defaults: Record<string, any>): ExtractProps<T> => {
    const o: any = {}
    for (const [key, value] of Object.entries(defaults)) {
        let typeConstructor: StringConstructor | NumberConstructor | BooleanConstructor | FunctionConstructor | ObjectConstructor | ArrayConstructor

        switch (typeof value) {
            case "string":
                typeConstructor = String
                break

            case "number":
                typeConstructor = Number
                break
            
            case "boolean":
                typeConstructor = Boolean
                break

            case "function":
                typeConstructor = Function
                break

            case "object"
        
            default:
                typeConstructor = String
                break
        }

        o[key] = {
            type: typeConstructor,
            default: defaults[key]
        }
    }
    return o
}