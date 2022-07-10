type NotArray = object & { length?: never }

export type ExtractProps<Type> = {
    [Property in keyof Type]: NonNullable<Type[Property]> extends string
        ? StringConstructor
        : NonNullable<Type[Property]> extends number
        ? NumberConstructor
        : NonNullable<Type[Property]> extends boolean
        ? BooleanConstructor
        : NonNullable<Type[Property]> extends Function
        ? FunctionConstructor
        : NonNullable<Type[Property]> extends Array<any>
        ? ArrayConstructor
        : NonNullable<Type[Property]> extends Object
        ? NonNullable<Type[Property]> extends NotArray
            ? ObjectConstructor
            : Array<any>
        : NumberConstructor
}
