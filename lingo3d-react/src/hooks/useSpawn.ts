import { useMemoOnce } from "@lincode/hooks"
import { nanoid } from "nanoid"
import { useRef, useState } from "react"

type Options<T extends Record<string, any>> = {
  lifetime?: number
  type?: string
  data?: T
  id?: string
}

export default <T extends Record<string, any> = Record<string, any>>(
  o?: Options<T>
) => {
  const doneRef = useRef(false)
  const optionSet = useMemoOnce(
    () => new Set<Options<T>>(),
    undefined,
    () => (doneRef.current = true)
  )

  const [options, setOptions] = useState<Array<Options<T>>>([])
  const spawn = (_o?: Options<T>) => {
    if (doneRef.current) return

    const options = { ...o, ..._o }
    options.id ??= nanoid()

    optionSet.add(options)
    setOptions([...optionSet])

    options.lifetime &&
      setTimeout(() => {
        if (doneRef.current) return

        optionSet.delete(options)
        setOptions([...optionSet])
      }, options.lifetime)
  }
  return <const>[options, spawn]
}
