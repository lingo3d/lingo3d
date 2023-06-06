import { useState, useLayoutEffect } from "preact/hooks"
import useLatest from "./useLatest"

export default (options: Array<string> | undefined, text: string) => {
    const optionsRef = useLatest(options)
    const [includeKeys, setIncludeKeys] = useState<Array<string>>()
    const filteredOptions = includeKeys ?? options ?? []
    const [selected, setSelected] = useState("")

    const selectNext = () => {
        if (!filteredOptions) return
        const index = filteredOptions.indexOf(selected) + 1
        setSelected(
            filteredOptions[index >= filteredOptions.length ? 0 : index]
        )
    }

    const selectPrev = () => {
        if (!filteredOptions) return
        const index = filteredOptions.indexOf(selected) - 1
        setSelected(
            filteredOptions[index < 0 ? filteredOptions.length - 1 : index]
        )
    }

    useLayoutEffect(() => {
        const options = optionsRef.current
        if (!options) return

        if (!text) {
            setIncludeKeys(undefined)
            return
        }
        setIncludeKeys(
            options.filter((key) =>
                key.toLowerCase().includes(text.toLowerCase())
            )
        )
    }, [text])

    useLayoutEffect(() => {
        if (!optionsRef.current || !filteredOptions || !text) return

        setSelected(filteredOptions[0])

        return () => {
            setSelected("")
        }
    }, [text, filteredOptions])

    return <const>[filteredOptions, selected, selectNext, selectPrev]
}
