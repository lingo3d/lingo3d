import { useLayoutEffect } from "preact/hooks"
import { setEditorMounted } from "../../states/useEditorMounted"

export default () => {
    useLayoutEffect(() => {
        setEditorMounted(true)

        return () => {
            setEditorMounted(false)
        }
    }, [])
}
