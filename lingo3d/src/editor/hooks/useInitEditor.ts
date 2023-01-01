import { useLayoutEffect } from "preact/hooks"
import { setEditorBehavior } from "../../states/useEditorBehavior"

export default () => {
    useLayoutEffect(() => {
        setEditorBehavior(true)

        return () => {
            setEditorBehavior(false)
        }
    }, [])
}
