import { preventTreeShake } from "@lincode/utils"
import { Pane } from "tweakpane"
import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"
import useInit from "../utils/useInit"
import addInputs from "./addInputs"

preventTreeShake(h)

type CustomEditorProps = {
    children?: JSX.Element | Array<JSX.Element>
}

const CustomEditor = ({ children }: CustomEditorProps) => {
    const elRef = useInit()
    const paneRef = useRef<Pane>()

    useEffect(() => {
        const el = elRef.current
        if (!el || !children) return

        const pane = (paneRef.current = new Pane({ container: el }))

        const params = Object.fromEntries(
            (Array.isArray(children) ? children : [children]).map((child) => [
                child.props.name,
                child.props.values ? child.props : child.props.value
            ])
        )
        const onChange = Object.fromEntries(
            (Array.isArray(children) ? children : [children]).map((child) => [
                child.props.name,
                child.props.onChange
            ])
        )
        addInputs(pane, "inputs", params, (name, value) =>
            onChange[name]?.(value)
        )

        return () => {
            pane.dispose()
        }
    }, [children])

    return (
        <div
            ref={elRef}
            className="lingo3d-ui"
            style={{ width: 300, background: "rgb(40, 41, 46)" }}
        />
    )
}

export default CustomEditor
