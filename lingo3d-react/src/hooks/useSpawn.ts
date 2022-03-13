import { useMemoOnce } from "@lincode/hooks"
import { nanoid } from "nanoid"
import { useState } from "react"

type Options = {
    lifetime?: number
    type?: string
    data?: Record<string, any>
    id?: string
}

export default (o?: Options) => {
    const bullets = useMemoOnce(() => new Set<Options>())
    const [, render] = useState({})

    const factory = (cb: (options: Options) => JSX.Element) => [...bullets].map(id => cb(id))
    const spawn = (_o?: Options) => {
        const options = { ...o, ..._o }
        options.id ??= nanoid()

        bullets.add(options)
        render({})

        options.lifetime && setTimeout(() => {
            bullets.delete(options)
            render({})
        }, options.lifetime)
    }
    return <const>[factory, spawn]
}