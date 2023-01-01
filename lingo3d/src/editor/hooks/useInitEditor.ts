import { useLayoutEffect } from "preact/hooks"
import {
    decreaseEditorCount,
    increaseEditorCount
} from "../../states/useEditorCount"

export default () => {
    useLayoutEffect(() => {
        increaseEditorCount()
        return () => {
            decreaseEditorCount()
        }
    }, [])
}
