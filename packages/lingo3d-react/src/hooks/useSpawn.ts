import { useMemoOnce } from "@lincode/hooks"
import { nanoid } from "nanoid"
import { useRef, useState } from "react"

type Options = {
    lifetime?: number
    type?: string
    data?: Record<string, any>
    id?: string
}

export default (o?: Options) => {
    const doneRef = useRef(false)
    const optionSet = useMemoOnce(() => new Set<Options>(), undefined, () => doneRef.current = true)

    const [options, setOptions] = useState<Array<Options>>([])
    const spawn = (_o?: Options) => {
        if (doneRef.current) return

        const options = { ...o, ..._o }
        options.id ??= nanoid()

        optionSet.add(options)
        setOptions([...optionSet])

        options.lifetime && setTimeout(() => {
            if (doneRef.current) return

            optionSet.delete(options)
            setOptions([...optionSet])
            
        }, options.lifetime)
    }
    return <const>[options, spawn]
}