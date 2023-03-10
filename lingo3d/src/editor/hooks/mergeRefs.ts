import { forceGetInstance } from "@lincode/utils"
import { MutableRefObject } from "preact/compat"

const functionElChecker = new WeakMap<Function, WeakSet<HTMLElement>>()

type Type = HTMLElement | SVGSVGElement | null

export default (
        ...inputRefs: Array<MutableRefObject<Type> | ((el: any) => any)>
    ) =>
    (el: Type) => {
        for (const inputRef of inputRefs) {
            if (typeof inputRef === "function") {
                if (!el) return
                const checker = forceGetInstance(
                    functionElChecker,
                    inputRef,
                    WeakSet
                )
                if (checker.has(el)) continue
                checker.add(el)
                inputRef(el)
                continue
            }
            inputRef.current = el
        }
    }
