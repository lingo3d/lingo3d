import { preventTreeShake } from "@lincode/utils"
import { Pane } from "tweakpane"
import { h } from "preact"
import { useEffect } from "preact/hooks"
import useInit from "../utils/useInit"

preventTreeShake(h)

type CustomEditorProps = {
    children: JSX.Element | Array<JSX.Element>
}

const CustomEditor = ({ children }: CustomEditorProps) => {
    const elRef = useInit()

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        console.log(children)

        return () => {
            pane.dispose()
        }
    }, [])

    return (
        <div
            ref={elRef}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="lingo3d-ui"
            style={{
                width: 300,
                height: "100%",
                background: "rgb(40, 41, 46)"
            }}
        />
    )
}

export default CustomEditor